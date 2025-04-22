"use client"

import { createClient } from '@supabase/supabase-js'

// Valores hardcoded para testes
const HARDCODED_URL = "https://pmuabkkctsfwquvcyfcx.supabase.co"
const HARDCODED_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdWFia2tjdHNmd3F1dmN5ZmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NTA3NTQsImV4cCI6MjA1OTAyNjc1NH0.YaiWUEOu0fL8VSniCW2OCrpZ-bmzJlcp6Djo3Cd6fYE"

// Tentar obter valores das variáveis de ambiente
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Usar hardcoded apenas se ambiente não estiver definido
const supabaseUrl = envUrl || HARDCODED_URL
const supabaseAnonKey = envKey || HARDCODED_KEY

console.log("DEBUG SUPABASE INIT:", { 
  usingEnvVars: !!(envUrl && envKey),
  urlLength: supabaseUrl?.length || 0,
  keyLength: supabaseAnonKey?.length || 0
})

// Cliente Supabase para debug
export const debugSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
})

// Funções para verificação do estado do Supabase
export async function checkSupabaseConnection() {
  try {
    console.log("Verificando conexão com Supabase...")
    const { data, error } = await debugSupabaseClient.from('profiles').select('count', { count: 'exact' }).limit(1)
    
    if (error) {
      console.error("Erro na conexão:", error)
      return { connected: false, error: error.message }
    }
    
    console.log("Conexão bem-sucedida:", data)
    return { connected: true, data }
  } catch (err: any) {
    console.error("Exceção ao verificar conexão:", err)
    return { connected: false, error: err.message || "Erro desconhecido" }
  }
}

export async function testAuth() {
  try {
    console.log("Testando autenticação Supabase...")
    const { data, error } = await debugSupabaseClient.auth.getSession()
    
    if (error) {
      console.error("Erro na autenticação:", error)
      return { success: false, error: error.message }
    }
    
    console.log("Autenticação funcionando:", data?.session ? "Sessão ativa" : "Sem sessão")
    return { 
      success: true, 
      hasSession: !!data.session,
      data 
    }
  } catch (err: any) {
    console.error("Exceção ao testar autenticação:", err)
    return { success: false, error: err.message || "Erro desconhecido" }
  }
}

export function getSupabaseConfig() {
  return {
    usingEnvVars: !!(envUrl && envKey),
    url: supabaseUrl,
    keyPartial: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 15)}...` : "Não definida"
  }
} 