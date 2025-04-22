"use client"

import { createClient } from '@supabase/supabase-js'

// Valores hardcoded definitivos
const SUPABASE_URL = "https://pmuabkkctsfwquvcyfcx.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdWFia2tjdHNmd3F1dmN5ZmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NTA3NTQsImV4cCI6MjA1OTAyNjc1NH0.YaiWUEOu0fL8VSniCW2OCrpZ-bmzJlcp6Djo3Cd6fYE"

// Cliente Supabase direto
export const browserSupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
})

// Função simples para login
export async function directLogin(email: string, password: string) {
  console.log(`Tentando login direto para: ${email}`)
  try {
    const response = await browserSupabaseClient.auth.signInWithPassword({
      email,
      password
    })
    
    console.log("Resposta do login direto:", response)
    return response
  } catch (err) {
    console.error("Erro no login direto:", err)
    throw err
  }
}

// Função simples para registro
export async function directSignUp(email: string, password: string) {
  console.log(`Tentando registro direto para: ${email}`)
  try {
    const response = await browserSupabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { email_confirmed: true }
      }
    })
    
    console.log("Resposta do registro direto:", response)
    return response
  } catch (err) {
    console.error("Erro no registro direto:", err)
    throw err
  }
}

// Função para teste de conexão
export async function testBrowserConnection() {
  try {
    console.log("Testando conexão browser com Supabase...")
    const { data, error } = await browserSupabaseClient.from('profiles').select('count', { count: 'exact' }).limit(1)
    
    if (error) {
      console.error("Erro na conexão browser:", error)
      return { connected: false, error: error.message }
    }
    
    console.log("Conexão browser bem-sucedida:", data)
    return { connected: true, data }
  } catch (err: any) {
    console.error("Exceção na conexão browser:", err)
    return { connected: false, error: err.message || "Erro desconhecido" }
  }
} 