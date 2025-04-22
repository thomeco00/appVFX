"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { debugSupabaseClient, checkSupabaseConnection, testAuth, getSupabaseConfig } from '@/lib/debug-supabase'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'

export default function DebugPage() {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean | null>(null)
  const [isDirectConnected, setIsDirectConnected] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [envVariables, setEnvVariables] = useState({
    supabaseUrl: "",
    supabaseKeyPartial: "",
    usingEnvVars: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [authStatus, setAuthStatus] = useState<string | null>(null)

  useEffect(() => {
    // Capturar valores das variáveis de ambiente
    const config = getSupabaseConfig()
    setEnvVariables({
      supabaseUrl: config.url,
      supabaseKeyPartial: config.keyPartial,
      usingEnvVars: config.usingEnvVars
    })
  }, [])

  const testRegularConnection = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log("Testando conexão com o Supabase normal...")
      const start = Date.now()
      
      // Tenta uma operação simples no Supabase
      const { data, error } = await supabase.from('profiles').select('count', { count: 'exact' }).limit(1)
      
      const end = Date.now()
      console.log(`Operação levou ${end - start}ms`)
      
      if (error) {
        console.error("Erro na conexão:", error)
        setError(`Erro: ${error.message}`)
        setIsSupabaseConnected(false)
      } else {
        console.log("Conexão bem-sucedida:", data)
        setIsSupabaseConnected(true)
      }
    } catch (err: any) {
      console.error("Exceção ao testar conexão:", err)
      setError(`Exceção: ${err.message || "Erro desconhecido"}`)
      setIsSupabaseConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  const testDirectConnection = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await checkSupabaseConnection()
      
      if (result.connected) {
        setIsDirectConnected(true)
        setError(null)
      } else {
        setIsDirectConnected(false)
        setError(`Erro na conexão direta: ${result.error}`)
      }
    } catch (err: any) {
      console.error("Exceção ao testar conexão direta:", err)
      setError(`Exceção direta: ${err.message || "Erro desconhecido"}`)
      setIsDirectConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  const testAuthConnection = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await testAuth()
      
      if (result.success) {
        setAuthStatus(result.hasSession ? "Sessão ativa encontrada" : "API de auth funcionando, sem sessão ativa")
      } else {
        setAuthStatus("Erro na API de autenticação")
        setError(`Erro de auth: ${result.error}`)
      }
    } catch (err: any) {
      console.error("Exceção ao testar auth:", err)
      setError(`Exceção auth: ${err.message || "Erro desconhecido"}`)
      setAuthStatus("Erro ao tentar comunicar com API de auth")
    } finally {
      setIsLoading(false)
    }
  }

  const testSignUp = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Email temporário para teste
      const testEmail = `test${Date.now()}@example.com`
      const testPassword = "password123456"
      
      console.log(`Tentando criar usuário de teste: ${testEmail}`)
      
      const { data, error } = await debugSupabaseClient.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            email_confirmed: true
          }
        }
      })
      
      if (error) {
        console.error("Erro ao criar usuário de teste:", error)
        setError(`Erro de registro: ${error.message}`)
      } else {
        console.log("Usuário de teste criado:", data)
        setError(null)
        alert(`Usuário de teste criado com sucesso: ${testEmail}`)
      }
    } catch (err: any) {
      console.error("Exceção ao criar usuário de teste:", err)
      setError(`Exceção signup: ${err.message || "Erro desconhecido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Página de Diagnóstico do Supabase</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuração do Supabase</CardTitle>
          <CardDescription>
            {envVariables.usingEnvVars 
              ? "Usando variáveis de ambiente" 
              : "Usando valores hardcoded de fallback"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>URL do Supabase:</strong> {envVariables.supabaseUrl}
            </div>
            <div>
              <strong>Chave anônima (parcial):</strong> {envVariables.supabaseKeyPartial}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Testes de Conexão</CardTitle>
          <CardDescription>Verifica se a aplicação consegue se conectar ao Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={testRegularConnection} disabled={isLoading}>
                {isLoading ? "Testando..." : "1. Testar Cliente Normal"}
              </Button>
              
              <Button onClick={testDirectConnection} disabled={isLoading} variant="secondary">
                {isLoading ? "Testando..." : "2. Testar Cliente Hardcoded"}
              </Button>
              
              <Button onClick={testAuthConnection} disabled={isLoading} variant="outline">
                {isLoading ? "Testando..." : "3. Testar Autenticação"}
              </Button>
              
              <Button onClick={testSignUp} disabled={isLoading} variant="destructive">
                {isLoading ? "Testando..." : "4. Testar Criação de Usuário"}
              </Button>
            </div>
            
            <div className="mt-4">
              <h3 className="font-bold">Resultados dos Testes:</h3>
              
              <div className="mt-2 space-y-2">
                {isSupabaseConnected !== null && (
                  <div className={`p-2 rounded ${isSupabaseConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    Cliente normal: {isSupabaseConnected ? '✅ Conectado' : '❌ Falha na conexão'}
                  </div>
                )}
                
                {isDirectConnected !== null && (
                  <div className={`p-2 rounded ${isDirectConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    Cliente hardcoded: {isDirectConnected ? '✅ Conectado' : '❌ Falha na conexão'}
                  </div>
                )}
                
                {authStatus && (
                  <div className="p-2 bg-blue-100 text-blue-800 rounded">
                    Status de autenticação: {authStatus}
                  </div>
                )}
                
                {error && (
                  <div className="p-2 bg-yellow-100 text-yellow-800 rounded">
                    ⚠️ {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-sm text-gray-500 mt-8">
        <p>Instruções para solução de problemas:</p>
        <ol className="list-decimal list-inside ml-4 space-y-2">
          <li>Primeiro, teste o cliente normal para ver se as variáveis de ambiente estão funcionando</li>
          <li>Depois, teste o cliente hardcoded para verificar se o problema está nas variáveis de ambiente</li>
          <li>Verifique a API de autenticação para confirmar se o erro é específico de auth ou geral</li>
          <li>Se todos os testes falharem, verifique as permissões CORS no Supabase</li>
          <li>Verifique também se não há bloqueios de rede ou firewall impedindo a conexão</li>
        </ol>
      </div>
    </div>
  )
} 