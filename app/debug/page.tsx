"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/lib/user-context"
import { supabase } from "@/lib/supabase"
import { createClient } from '@supabase/supabase-js'
import Link from "next/link"

export default function DebugPage() {
  const { user, status, session } = useUser()
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testColor, setTestColor] = useState("text-gray-500")
  const [envVariables, setEnvVariables] = useState<{[key: string]: string | undefined}>({})
  const [manualUrl, setManualUrl] = useState("")
  const [manualKey, setManualKey] = useState("")
  
  useEffect(() => {
    // Verificar variáveis de ambiente
    setEnvVariables({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
        `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 8)}...` : undefined
    })
    
    // Valores para testar manualmente
    setManualUrl("https://pmuabkkctsfwquvcyfcx.supabase.co")
    setManualKey("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdWFia2tjdHNmd3F1dmN5ZmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NTA3NTQsImV4cCI6MjA1OTAyNjc1NH0.YaiWUEOu0fL8VSniCW2OCrpZ-bmzJlcp6Djo3Cd6fYE")
  }, [])
  
  const testSupabaseConnection = async () => {
    try {
      setTestResult("Testando conexão...")
      setTestColor("text-blue-500")
      
      const { data, error } = await supabase.from('profiles').select('*').limit(1)
      
      if (error) {
        console.error("Erro no teste de conexão:", error)
        setTestResult(`Erro na conexão: ${error.message}`)
        setTestColor("text-red-500")
        return
      }
      
      setTestResult(`Conexão bem-sucedida! Dados recebidos: ${JSON.stringify(data)}`)
      setTestColor("text-green-500")
    } catch (err) {
      console.error("Exceção no teste:", err)
      setTestResult(`Exceção: ${err instanceof Error ? err.message : String(err)}`)
      setTestColor("text-red-500")
    }
  }
  
  const testManualConnection = async () => {
    try {
      setTestResult("Testando conexão manual...")
      setTestColor("text-blue-500")
      
      const manualClient = createClient(manualUrl, manualKey)
      const { data, error } = await manualClient.from('profiles').select('*').limit(1)
      
      if (error) {
        console.error("Erro no teste manual:", error)
        setTestResult(`Erro na conexão manual: ${error.message}`)
        setTestColor("text-red-500")
        return
      }
      
      setTestResult(`Conexão manual bem-sucedida! Dados recebidos: ${JSON.stringify(data)}`)
      setTestColor("text-green-500")
    } catch (err) {
      console.error("Exceção no teste manual:", err)
      setTestResult(`Exceção manual: ${err instanceof Error ? err.message : String(err)}`)
      setTestColor("text-red-500")
    }
  }
  
  const forceRedirect = () => {
    window.location.href = "/dashboard"
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-center">Página de Diagnóstico</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Status de Autenticação</CardTitle>
            <CardDescription>Informações sobre o estado atual do usuário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md">
              <p><strong>Status:</strong> <span className={
                status === 'authenticated' ? 'text-green-500' : 
                status === 'loading' ? 'text-yellow-500' : 
                'text-red-500'
              }>{status}</span></p>
              <p><strong>Usuário:</strong> {user ? user.email : 'Nenhum usuário logado'}</p>
              <p><strong>ID:</strong> {user ? user.id : 'N/A'}</p>
              <p><strong>Sessão ativa:</strong> {session ? 'Sim' : 'Não'}</p>
              <p><strong>Token:</strong> {session ? `${session.access_token.substring(0, 8)}...` : 'N/A'}</p>
            </div>
            
            <div className="flex space-x-3">
              <Button onClick={forceRedirect} variant="secondary">
                Forçar Redirecionamento para Dashboard
              </Button>
              <Link href="/login-bypass">
                <Button variant="outline">
                  Ir para Login Alternativo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Variáveis de Ambiente</CardTitle>
            <CardDescription>Verificação das configurações de ambiente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md">
              {Object.entries(envVariables).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {value || 'Não definida'}</p>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Teste de Conexão Supabase</CardTitle>
            <CardDescription>Testar conexão com o banco de dados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testSupabaseConnection}>
              Testar Conexão Supabase
            </Button>
            
            {testResult && (
              <div className={`p-4 border rounded-md ${testColor}`}>
                <p>{testResult}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Teste com Credenciais Hardcoded</CardTitle>
            <CardDescription>Testar conexão com credenciais fixas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manualUrl">URL do Supabase</Label>
                <Input 
                  id="manualUrl" 
                  value={manualUrl} 
                  onChange={(e) => setManualUrl(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manualKey">Chave Anônima</Label>
                <Input 
                  id="manualKey" 
                  value={manualKey} 
                  onChange={(e) => setManualKey(e.target.value)} 
                />
              </div>
            </div>
            
            <Button onClick={testManualConnection}>
              Testar Conexão Manual
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 