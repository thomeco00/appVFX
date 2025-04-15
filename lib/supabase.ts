"use client"

import { createClient } from '@supabase/supabase-js'

// Tipos para as entidades do banco de dados
export type Profile = {
  id: string
  created_at?: string
  updated_at?: string
  username: string
  full_name: string
  avatar_url: string
  subscription_tier?: string
  subscription_status?: string
  bio?: string
  company_name?: string
  industry?: string
  target_audience?: string
  company_description?: string
  instagram_username?: string
  employee_count?: string
  email?: string
  has_completed_profile?: boolean
  has_completed_welcome?: boolean
  has_completed_tutorial?: boolean
}

export type Calendar = {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  title: string
  description: string
  month: number
  year: number
  status: 'active' | 'archived'
}

export type CalendarEntry = {
  id: string
  created_at: string
  updated_at: string
  calendar_id: string
  day: number
  title: string
  description: string
  type: string
  hashtags: string[]
  engagement_estimate: string
}

export type CompanyProfile = {
  id?: string
  company_name: string
  industry: string
  size: string
  instagram_username?: string
  target_audience?: string
  description?: string
  created_at?: string
  website?: string
  phone?: string
  location?: string
  main_color?: string
  logo_url?: string
}

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERRO CRÍTICO: Credenciais do Supabase não estão definidas!")
  console.error("URL:", supabaseUrl)
  console.error("Key existente:", !!supabaseAnonKey)
}

console.log("Inicializando Supabase com URL:", supabaseUrl)

// Criar cliente Supabase com configurações básicas
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
)

// Função para verificar explicitamente se um usuário está autenticado
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error("Erro ao verificar autenticação:", error.message)
      return false
    }
    
    return !!data.session
  } catch (err) {
    console.error("Exceção ao verificar autenticação:", err)
    return false
  }
}

// Obter o perfil do usuário
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Erro ao buscar perfil:', error.message)
      return null
    }
    
    return data as Profile
  } catch (error) {
    console.error('Exceção ao buscar perfil:', error)
    return null
  }
}

// Criar um novo perfil de usuário
export const createUserProfile = async (
  userId: string,
  profileData: Partial<Profile>
): Promise<boolean> => {
  try {
    console.log("Criando perfil para usuário:", userId)
    const { error } = await supabase.from('profiles').insert([
      {
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      },
    ])
    
    if (error) {
      console.error('Erro ao criar perfil:', error.message)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Exceção ao criar perfil:', error)
    return false
  }
}

// Atualizar um perfil existente
export const updateUserProfile = async (
  userId: string,
  profileData: Partial<Profile>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
    
    if (error) {
      console.error('Erro ao atualizar perfil:', error.message)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Exceção ao atualizar perfil:', error)
    return false
  }
}

// Obter o calendário do usuário
export const getUserCalendar = async (userId: string): Promise<Calendar[]> => {
  try {
    const { data, error } = await supabase
      .from('calendars')
      .select('*')
      .eq('user_id', userId)
    
    if (error) {
      throw error
    }
    
    return data as Calendar[]
  } catch (error) {
    console.error('Erro ao buscar calendário:', error)
    return []
  }
}

// Adicionar um item ao calendário
export const addCalendarItem = async (item: CalendarEntry): Promise<boolean> => {
  try {
    const { error } = await supabase.from('calendar_entries').insert([item])
    
    if (error) {
      console.error('Erro ao adicionar item ao calendário:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Erro ao adicionar item ao calendário:', error)
    return false
  }
}

// Remover um item do calendário
export const removeCalendarItem = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('calendar_entries')
      .delete()
      .eq('id', itemId)
    
    if (error) {
      console.error('Erro ao remover item do calendário:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Erro ao remover item do calendário:', error)
    return false
  }
}

// ==== CALENDÁRIOS ====

// Criar um novo calendário
export const createCalendar = async (
  userId: string,
  calendarData: Partial<Calendar>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('calendars')
      .insert([
        {
          user_id: userId,
          ...calendarData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('Erro ao criar calendário:', error.message)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.[0]?.id }
  } catch (error: any) {
    console.error('Exceção ao criar calendário:', error)
    return { success: false, error: error.message }
  }
}

// Obter calendários do usuário
export const getUserCalendars = async (
  userId: string
): Promise<Calendar[] | null> => {
  try {
    const { data, error } = await supabase
      .from('calendars')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar calendários:', error.message)
      return null
    }

    return data
  } catch (error) {
    console.error('Exceção ao buscar calendários:', error)
    return null
  }
}

// Obter um calendário específico
export const getCalendarById = async (
  calendarId: string
): Promise<Calendar | null> => {
  try {
    const { data, error } = await supabase
      .from('calendars')
      .select('*')
      .eq('id', calendarId)
      .single()

    if (error) {
      console.error('Erro ao buscar calendário:', error.message)
      return null
    }

    return data
  } catch (error) {
    console.error('Exceção ao buscar calendário:', error)
    return null
  }
}

// Atualizar um calendário existente
export const updateCalendar = async (
  calendarId: string,
  calendarData: Partial<Calendar>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('calendars')
      .update({
        ...calendarData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', calendarId)

    if (error) {
      console.error('Erro ao atualizar calendário:', error.message)
      return false
    }

    return true
  } catch (error) {
    console.error('Exceção ao atualizar calendário:', error)
    return false
  }
}

// Excluir um calendário
export const deleteCalendar = async (calendarId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('calendars')
      .delete()
      .eq('id', calendarId)

    if (error) {
      console.error('Erro ao excluir calendário:', error.message)
      return false
    }

    return true
  } catch (error) {
    console.error('Exceção ao excluir calendário:', error)
    return false
  }
}

// Funções para gerenciamento de calendários
export async function getCurrentCalendar(userId: string): Promise<Calendar | null> {
  const { data, error } = await supabase
    .from('calendars')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Erro ao buscar calendário atual:', error)
    return null
  }

  return data
}

export async function getCalendarHistory(userId: string): Promise<Calendar[]> {
  const { data, error } = await supabase
    .from('calendars')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar histórico de calendários:', error)
    return []
  }

  return data || []
}

export async function getCalendarEntries(calendarId: string): Promise<CalendarEntry[]> {
  const { data, error } = await supabase
    .from('calendar_entries')
    .select('*')
    .eq('calendar_id', calendarId)
    .order('day', { ascending: true })

  if (error) {
    console.error('Erro ao buscar entradas do calendário:', error)
    return []
  }

  return data || []
}

export async function createNewCalendar(
  userId: string, 
  title: string, 
  description: string, 
  month: number, 
  year: number
): Promise<Calendar | null> {
  // Função para criar um novo calendário, que ativa o trigger para arquivar os anteriores
  const { data, error } = await supabase
    .from('calendars')
    .insert([
      {
        user_id: userId,
        title,
        description,
        month,
        year,
        status: 'active',
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar novo calendário:', error)
    return null
  }

  return data
}

export async function createCalendarEntries(
  calendarId: string,
  entries: Omit<CalendarEntry, 'id' | 'created_at' | 'updated_at' | 'calendar_id'>[]
): Promise<boolean> {
  // Prepara as entradas para inserção associando o calendar_id
  const entriesToInsert = entries.map(entry => ({
    ...entry,
    calendar_id: calendarId
  }))

  const { error } = await supabase
    .from('calendar_entries')
    .insert(entriesToInsert)

  if (error) {
    console.error('Erro ao criar entradas do calendário:', error)
    return false
  }

  return true
}

// Função para buscar o perfil da empresa
export async function getCompanyProfile(userId: string): Promise<CompanyProfile | null> {
  if (!userId) {
    console.error("ID de usuário vazio ao buscar perfil da empresa")
    return null
  }
  
  try {
    const { data, error } = await supabase
      .from("company_profiles")
      .select("*")
      .eq("user_id", userId)
      .single()
    
    if (error) {
      if (error.code === "PGRST116") {
        // Erro de registro não encontrado (esperado para novos usuários)
        console.log("Perfil de empresa não encontrado para o usuário")
        return null
      }
      console.error("Erro ao buscar perfil da empresa:", error.message)
      return null
    }
    
    return data as CompanyProfile
  } catch (error: any) {
    console.error("Erro ao buscar perfil da empresa:", error.message)
    return null
  }
}

// Função para criar ou atualizar o perfil da empresa
export async function upsertCompanyProfile(
  userId: string,
  companyProfile: CompanyProfile
): Promise<CompanyProfile | null> {
  if (!userId) {
    throw new Error("ID de usuário obrigatório para salvar perfil da empresa")
  }
  
  try {
    const { data, error } = await supabase
      .from("company_profiles")
      .upsert({
        user_id: userId,
        company_name: companyProfile.company_name,
        industry: companyProfile.industry,
        size: companyProfile.size,
        instagram_username: companyProfile.instagram_username || null,
        target_audience: companyProfile.target_audience || null,
        description: companyProfile.description || null,
        website: companyProfile.website || null,
        phone: companyProfile.phone || null,
        location: companyProfile.location || null,
        main_color: companyProfile.main_color || null,
        logo_url: companyProfile.logo_url || null,
      })
      .select()
    
    if (error) {
      console.error("Erro ao salvar perfil da empresa:", error.message)
      throw error
    }
    
    if (!data || data.length === 0) {
      console.error("Nenhum dado retornado após upsert do perfil da empresa")
      return null
    }
    
    return data[0] as CompanyProfile
  } catch (error: any) {
    console.error("Erro ao salvar perfil da empresa:", error.message)
    throw error
  }
} 