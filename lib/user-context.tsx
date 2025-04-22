"use client"

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, getUserProfile } from './supabase'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

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
        console.error('Erro ao obter sessão:', error.message)
        setUser(null)
        setSession(null)
        setStatus('unauthenticated')
        return
      }
      
      // Se não houver sessão, definir como não autenticado
      if (!currentSession) {
        console.log('Nenhuma sessão ativa encontrada')
        setUser(null)
        setSession(null)
        setStatus('unauthenticated')
        return
      }
      
      // Se chegou aqui, a sessão é válida
      console.log('Sessão encontrada:', currentSession.user.email)
      setUser(currentSession.user)
      setSession(currentSession)
      setStatus('authenticated')
      
    } catch (err) {
      console.error('Exceção ao verificar autenticação:', err)
      setUser(null)
      setSession(null)
      setStatus('unauthenticated')
    }
  }

  // Carregar ao montar o componente
  useEffect(() => {
    loadUserAndSession()

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Mudança de estado de autenticação:', event)
        
        if (event === 'SIGNED_IN' && newSession) {
          setUser(newSession.user)
          setSession(newSession)
          setStatus('authenticated')
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
      console.log('Tentando login com email:', email)
      
      // Tentar fazer login com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Erro de autenticação:', error.message)
        
        // Personalizar mensagens de erro
        if (error.message.includes('Email not confirmed')) {
          return { 
            error: { 
              ...error, 
              message: 'Email não confirmado. Por favor, verifique seu email e clique no link de confirmação.' 
            } 
          }
        }
        
        return { error }
      }
      
      // Se login bem-sucedido, atualizar estado
      if (data.user) {
        console.log('Login bem-sucedido:', data.user.email)
        setUser(data.user)
        setSession(data.session)
        setStatus('authenticated')
        return { data, error: null }
      } else {
        console.error('Login falhou: nenhum usuário retornado')
        return { error: { message: 'Falha ao verificar credenciais' } }
      }
    } catch (err) {
      console.error('Exceção durante login:', err)
      return { error: err }
    }
  }

  // Função para registro
  const signUp = async (email: string, password: string) => {
    try {
      // Voltar a usar a confirmação de e-mail
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        }
      })
      
      if (error) {
        console.error("Erro ao criar conta:", error.message)
        return { error, data: null }
      }
      
      console.log("Status de confirmação:", data?.user?.confirmed_at ? "Confirmado" : "Aguardando confirmação")
      
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