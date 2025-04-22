import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Use variáveis de ambiente do Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

// Este handler é executado quando a função Edge é invocada
serve(async (req) => {
  try {
    // Criar um cliente do Supabase com a chave de serviço
    // IMPORTANTE: Esta chave tem acesso completo ao banco de dados
    // Tenha cuidado ao utilizar essas funções em produção
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { userId } = await req.json()
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'ID do usuário não fornecido' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Confirmar o e-mail do usuário manualmente
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { email_confirm: true }
    )
    
    if (error) {
      console.error('Erro ao confirmar usuário:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    return new Response(
      JSON.stringify({ message: 'Usuário confirmado com sucesso', user: data }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (err) {
    console.error('Erro ao processar requisição:', err)
    return new Response(
      JSON.stringify({ error: err.message || 'Erro interno' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}) 