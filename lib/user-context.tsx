"use client"

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, getUserProfile, createUserProfile, getCompanyProfile } from './supabase'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { createClient } from '@supabase/supabase-js'
import { browserSupabaseClient, directLogin, directSignUp } from './browser-supabase'

// IMPORTANTE: Cliente alternativo com valores fixos garantidos
const FALLBACK_SUPABASE_URL = "https://pmuabkkctsfwquvcyfcx.supabase.co"
const FALLBACK_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdWFia2tjdHNmd3F1dmN5ZmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NTA3NTQsImV4cCI6MjA1OTAyNjc1NH0.YaiWUEOu0fL8VSniCW2OCrpZ-bmzJlcp6Djo3Cd6fYE"

const fallbackClient = createClient(
  FALLBACK_SUPABASE_URL,
  FALLBACK_SUPABASE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Escolher o cliente apropriado - usar fallback se o principal não estiver configurado
const getClient = () => {
  // Verificar se o cliente principal tem credenciais definidas
  try {
    // Verificar se a URL do supabase está disponível através do ambiente
    const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!envUrl || envUrl === '') {
      console.log("UserContext: Variáveis de ambiente não encontradas, usando cliente fallback com valores hardcoded")
      return browserSupabaseClient || fallbackClient
    }
    
    console.log("UserContext: Usando cliente Supabase padrão com variáveis de ambiente")
    return supabase
  } catch (err) {
    console.error("UserContext: Erro ao verificar cliente:", err)
    console.log("UserContext: Usando cliente fallback devido a erro")
    return browserSupabaseClient || fallbackClient
  }
}

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
      console.log("UserContext: Carregando sessão inicial")
      setStatus('loading')
      
      const activeClient = getClient()
      const { data: { session: currentSession }, error } = await activeClient.auth.getSession()
      
      if (error) {
        console.error("UserContext: Erro ao carregar sessão:", error.message)
        setUser(null)
        setSession(null)
        setStatus('unauthenticated')
        return
      }
      
      // Se não houver sessão, definir como não autenticado
      if (!currentSession) {
        console.log("UserContext: Nenhuma sessão ativa encontrada")
        setUser(null)
        setSession(null)
        setStatus('unauthenticated')
        return
      }
      
      // Se chegou aqui, a sessão é válida
      console.log("UserContext: Sessão ativa encontrada para usuário:", currentSession.user.id)
      setUser(currentSession.user)
      setSession(currentSession)
      setStatus('authenticated')
      
    } catch (err) {
      console.error("UserContext: Exceção ao carregar sessão:", err)
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
      console.warn("Erro ao verificar perfil da empresa, redirecionando para dashboard:", error)
      router.push('/dashboard')
    }
  }

  // Carregar ao montar o componente e configurar listener
  useEffect(() => {
    console.log("UserContext: Inicializando provider")
    
    // Primeira carga da sessão
    loadUserAndSession();
    
    // Configurar listener para mudanças de autenticação
    const activeClient = getClient()
    console.log("UserContext: Configurando listener de autenticação")
    
    // Este listener é crucial para manter o estado sincronizado com a autenticação
    const { data: authListener } = activeClient.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("UserContext: Evento de autenticação:", event)
        
        // Quando o usuário faz login, atualizar o estado
        if (event === 'SIGNED_IN' && newSession) {
          console.log("UserContext: Evento SIGNED_IN detectado, atualizando estado")
          setUser(newSession.user)
          setSession(newSession)
          setStatus('authenticated')
        } 
        // Quando o usuário faz logout, limpar o estado
        else if (event === 'SIGNED_OUT') {
          console.log("UserContext: Evento SIGNED_OUT detectado, limpando estado")
          setUser(null)
          setSession(null)
          setStatus('unauthenticated')
        } 
        // Atualização de token - manter o estado atual
        else if (event === 'TOKEN_REFRESHED' && newSession) {
          console.log("UserContext: Token renovado, atualizando sessão")
          setSession(newSession)
        }
      }
    )

    // Cleanup ao desmontar
    return () => {
      console.log("UserContext: Desinstalando provider")
      authListener?.subscription.unsubscribe()
    }
  }, [router])

  // Função para recarregar o estado do usuário
  const reload = async () => {
    await loadUserAndSession()
  }

  // Função para login - simplificada para evitar problemas de estado
  const signIn = async (email: string, password: string) => {
    try {
      console.log("UserContext: Tentando login para:", email)
      
      if (!email || !password) {
        console.error("UserContext: Email ou senha vazios")
        return { error: { message: "Email e senha são obrigatórios" } }
      }
      
      // Definir loading state
      setStatus('loading')
      
      // Obter cliente ativo
      const activeClient = getClient()
      
      // Tentar login
      console.log("UserContext: Chamando auth.signInWithPassword")
      const response = await activeClient.auth.signInWithPassword({
        email,
        password
      })
      
      console.log("UserContext: Resposta do login:", 
                "Erro:", !!response.error, 
                "Usuário:", !!response.data?.user)
      
      if (response.error) {
        console.error("UserContext: Erro de login:", response.error.message)
        // Retornar ao estado não autenticado em caso de erro
        setStatus('unauthenticated')
        return { error: response.error }
      }
      
      // Login bem-sucedido - o evento SIGNED_IN do listener onAuthStateChange
      // irá atualizar o estado automaticamente
      
      return { data: response.data, error: null }
    } catch (err) {
      console.error("UserContext: Exceção no login:", err)
      setStatus('unauthenticated')
      return { error: err }
    }
  }

  // Função para registro
  const signUp = async (email: string, password: string) => {
    try {
      console.log('UserContext: Iniciando registro para:', email)
      
      // Obter cliente ativo
      const activeClient = getClient()
      
      // Registrar o usuário
      const { data, error } = await activeClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            email_confirmed: true // Para ajudar na identificação do usuário
          }
        }
      })
      
      if (error) {
        console.error("UserContext: Erro ao criar conta:", error.message)
        return { error, data: null }
      }
      
      console.log("UserContext: Usuário criado com sucesso:", data)
      
      // Login automático após registro é opcional, já que o formulário
      // de registro normalmente redireciona para confirmação ou login
      
      return { data, error: null }
    } catch (err: any) {
      console.error("UserContext: Exceção durante registro:", err)
      return { 
        error: { message: err.message || "Erro ao criar conta" }, 
        data: null 
      }
    }
  }

  // Função para logout
  const signOut = async () => {
    try {
      console.log("UserContext: Iniciando logout")
      const activeClient = getClient()
      const { error } = await activeClient.auth.signOut()
      
      if (error) {
        console.error("UserContext: Erro ao fazer logout:", error.message)
        toast({
          title: "Erro ao sair",
          description: "Não foi possível finalizar sua sessão. Tente novamente.",
          variant: "destructive"
        })
        return
      }
      
      // O evento SIGNED_OUT do listener irá limpar o estado
      
    } catch (err) {
      console.error("UserContext: Exceção durante logout:", err)
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