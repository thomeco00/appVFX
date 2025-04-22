"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { debugSupabaseClient } from '@/lib/debug-supabase'
import { browserSupabaseClient, directLogin, directSignUp } from '@/lib/browser-supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AlternativeLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const router = useRouter()

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().slice(11, 19)}: ${message}`])
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    addLog(`Iniciando login com email: ${email}`)

    try {
      // Tentar login diretamente com o cliente Supabase do browser
      addLog('Chamando login direto via browser')
      
      const { data, error } = await directLogin(email, password)

      if (error) {
        addLog(`ERRO: ${error.message}`)
        setError(error.message)
        setIsLoading(false)
        return
      }

      addLog(`LOGIN BEM-SUCEDIDO! User ID: ${data.user?.id}`)
      
      // Redirecionar para dashboard em caso de sucesso
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
      
    } catch (err: any) {
      addLog(`EXCEÇÃO: ${err.message || 'Erro desconhecido'}`)
      setError(err.message || 'Ocorreu um erro ao processar o login')
    } finally {
      setIsLoading(false)
    }
  }

  const testSignUp = async () => {
    setIsLoading(true)
    setError(null)
    addLog(`Iniciando teste de registro com email: ${email}`)
    
    try {
      // Criar um email único com timestamp
      const testEmail = email || `test${Date.now()}@example.com`
      const testPassword = password || 'password123456'
      
      addLog(`Chamando registro direto com email: ${testEmail}`)
      
      const { data, error } = await directSignUp(testEmail, testPassword)
      
      if (error) {
        addLog(`ERRO REGISTRO: ${error.message}`)
        setError(error.message)
      } else {
        addLog(`REGISTRO BEM-SUCEDIDO! User ID: ${data.user?.id}`)
        setError(null)
        alert(`Usuário criado com sucesso: ${testEmail}`)
      }
    } catch (err: any) {
      addLog(`EXCEÇÃO REGISTRO: ${err.message || 'Erro desconhecido'}`)
      setError(err.message || 'Ocorreu um erro ao registrar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Login Alternativo</CardTitle>
          <CardDescription>Usando conexão direta com Supabase</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                {error}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex-col space-y-2">
            <div className="flex w-full gap-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Processando...' : 'Login Direto'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={testSignUp}
                disabled={isLoading}
                className="flex-1"
              >
                Registro Direto
              </Button>
            </div>
            
            <div className="w-full text-center text-sm mt-2">
              <Link href="/debug" className="text-blue-600 hover:underline">
                Página de Diagnóstico
              </Link>
              {' | '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login Normal
              </Link>
            </div>
          </CardFooter>
        </form>
        
        {logs.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="font-semibold mb-2">Logs do processo:</h3>
            <div className="bg-black text-green-400 p-2 rounded-md text-xs font-mono h-40 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
} 