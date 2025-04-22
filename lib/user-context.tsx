"use client"

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, getUserProfile, createUserProfile, getCompanyProfile } from './supabase'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types_db'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type UserContextType = {
  user: User | null
  session: Session | null
  status: AuthStatus
  signIn: (email: string, password: string) => Promise<{ error: any, data?: { user: User | null } }>
  signUp: (email: string, password: string) => Promise<{ error: any, data: any }>
  signOut: () => Promise<void>
  reload: () => Promise<void>
}

// Valor padrão do contexto
const UserContext = createContext<UserContextType>({
  user: null,
  session: null,
  status: 'loading',
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  reload: async () => {},
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const router = useRouter()

  // Carregar usuário e sessão iniciais
  const loadUserAndSession = async () => {
    try {
      setStatus('loading')
      
      const { data: { session: currentSession }, error } = await supabase.auth.getSession()
      
      if (error) {
        setUser(null)
        setSession(null)
        setStatus('unauthenticated')
        return
      }
      
      // Se não houver sessão, definir como não autenticado
      if (!currentSession) {
        setUser(null)
        setSession(null)
        setStatus('unauthenticated')
        return
      }
      
      // Se chegou aqui, a sessão é válida
      setUser(currentSession.user)
      setSession(currentSession)
      setStatus('authenticated')
      
    } catch (err) {
      setUser(null)
      setSession(null)
      setStatus('unauthenticated')
    }
  }

  // Redirecionamento inteligente baseado no perfil do usuário
  const redirectBasedOnProfile = async (userId: string) => {
    try {
      // Verificar se o perfil de empresa existe
      const companyProfile = await getCompanyProfile(userId)
      
      if (!companyProfile) {
        // Se não tiver perfil de empresa, redirecionar para criação
        router.push('/company-profile')
      } else {
        // Se já tiver perfil completo, ir para o dashboard
        router.push('/dashboard')
      }
    } catch (error) {
      // Em caso de erro, ir para o dashboard de qualquer forma
      router.push('/dashboard')
    }
  }

  // Carregar ao montar o componente
  useEffect(() => {
    loadUserAndSession()

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (event === 'SIGNED_IN' && newSession) {
          setUser(newSession.user)
          setSession(newSession)
          setStatus('authenticated')
          
          // Redirecionar com base no perfil quando o login for concluído
          await redirectBasedOnProfile(newSession.user.id)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setSession(null)
          setStatus('unauthenticated')
          router.push('/login')
        } else if (event === 'TOKEN_REFRESHED' && newSession) {
          setUser(newSession.user)
          setSession(newSession)
        }
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [router])

  // Função para recarregar o estado do usuário
  const reload = async () => {
    await loadUserAndSession()
  }

  // Função para login
  const signIn = async (email: string, password: string) => {
    try {
      console.log("UserContext: Iniciando signIn para", email);
      
      // Verificar se os parâmetros são válidos
      if (!email || !password) {
        console.error("UserContext: Email ou senha vazios");
        return { error: { message: "Email e senha são obrigatórios" } };
      }
      
      // Definir loading state
      setStatus('loading');
      
      // Tentar fazer login com Supabase
      console.log("UserContext: Chamando supabase.auth.signInWithPassword");
      const response = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log("UserContext: Resposta do supabase:", 
                  "Erro:", !!response.error, 
                  "Usuário:", !!response.data?.user);
      
      if (response.error) {
        console.error("UserContext: Erro de login:", response.error.message);
        // Retornar ao estado não autenticado em caso de erro
        setStatus('unauthenticated');
        return { error: response.error };
      }
      
      // Se login bem-sucedido, atualizar estado
      if (response.data?.user) {
        console.log("UserContext: Login bem-sucedido, atualizando estado");
        // Atualizar estado
        setUser(response.data.user);
        setSession(response.data.session);
        setStatus('authenticated');
        
        // Verificamos se o perfil do usuário existe e temos informações mínimas necessárias
        try {
          console.log("UserContext: Verificando perfil do usuário");
          const profile = await getUserProfile(response.data.user.id);
          
          // Se não tiver perfil, vamos criar um básico
          if (!profile) {
            console.log("UserContext: Perfil não encontrado, criando perfil básico");
            await createUserProfile(response.data.user.id, {
              id: response.data.user.id,
              email: response.data.user.email || email,
              username: (response.data.user.email || email).split('@')[0],
              full_name: '',
              avatar_url: '',
              has_completed_profile: false
            });
          }
          
          console.log("UserContext: Login processado com sucesso");
          // Retornar sucesso com os dados
          return { data: response.data, error: null };
        } catch (profileError) {
          console.error("UserContext: Erro ao verificar/criar perfil:", profileError);
          // Mesmo com erro de perfil, o login ainda é válido
          return { data: response.data, error: null };
        }
      } else {
        console.error("UserContext: Login falhou - sem usuário na resposta");
        setStatus('unauthenticated');
        return { error: { message: 'Falha ao verificar credenciais' } };
      }
    } catch (err) {
      console.error("UserContext: Exceção no login:", err);
      setStatus('unauthenticated');
      return { error: err };
    }
  }

  // Função para registro
  const signUp = async (email: string, password: string) => {
    try {
      console.log('Iniciando registro para:', email)
      
      // Registrar o usuário
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email_confirmed: true // Para ajudar na identificação do usuário
          }
        }
      })
      
      if (error) {
        console.error("Erro ao criar conta:", error.message)
        return { error, data: null }
      }
      
      console.log("Usuário criado com sucesso:", data)
      
      // SOLUÇÃO DEFINITIVA: Fazer login imediatamente após o registro
      // Independentemente da confirmação de email
      if (data?.user) {
        try {
          console.log("Tentando login automático após registro")
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
          })
          
          if (loginError) {
            console.error("Erro ao fazer login após registro:", loginError)
          } else {
            console.log("Login automático após registro bem-sucedido")
            // Atualizar o estado após login bem-sucedido
            setUser(loginData.user)
            setSession(loginData.session)
            setStatus('authenticated')
          }
        } catch (loginErr) {
          console.error("Exceção ao tentar login após registro:", loginErr)
        }
      }
      
      return { data, error: null }
    } catch (err: any) {
      console.error("Exceção durante registro:", err)
      return { 
        error: { message: err.message || "Erro ao criar conta" }, 
        data: null 
      }
    }
  }

  // Função para logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error("Erro ao fazer logout:", error.message)
        toast({
          title: "Erro ao sair",
          description: "Não foi possível finalizar sua sessão. Tente novamente.",
          variant: "destructive"
        })
        return
      }
      
      // Limpar estado local
      setUser(null)
      setSession(null)
      setStatus('unauthenticated')
      
      // Redirecionar para login
      router.push('/login')
    } catch (err) {
      console.error("Exceção durante logout:", err)
    }
  }

  return (
    <UserContext.Provider value={{ 
      user,
      session,
      status,
      signIn,
      signUp,
      signOut,
      reload
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext) 