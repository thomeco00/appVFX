"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-context"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { createClient } from '@supabase/supabase-js'

// Cliente de fallback diretamente nesta página
const FALLBACK_SUPABASE_URL = "https://pmuabkkctsfwquvcyfcx.supabase.co"
const FALLBACK_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdWFia2tjdHNmd3F1dmN5ZmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NTA3NTQsImV4cCI6MjA1OTAyNjc1NH0.YaiWUEOu0fL8VSniCW2OCrpZ-bmzJlcp6Djo3Cd6fYE"

// Função para obter o cliente Supabase
const getSupabaseClient = () => {
  // Verificar se o cliente principal tem credenciais definidas
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log("Bypass: Usando cliente fallback com valores hardcoded")
    return createClient(
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
  }
  
  return supabase
}

export default function LoginBypassPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const { user, status } = useUser()

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    console.log("Status atual na página bypass:", status)
    console.log("Usuário na página bypass:", user)
    
    if (user) {
      console.log("Usuário já autenticado, exibindo botão de acesso direto")
    }
  }, [user, status])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      // Obter o cliente Supabase
      const supabaseClient = getSupabaseClient()
      
      // Tentar login
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setError(error.message)
        toast({
          title: "Erro de login",
          description: error.message,
          variant: "destructive"
        })
        setIsLoading(false)
        return
      }
      
      // Login bem-sucedido
      console.log("Login bypass bem-sucedido:", data)
      
      // Armazenar token na sessionStorage para uso posterior
      if (data.session) {
        sessionStorage.setItem("supabase.auth.token", data.session.access_token)
      }
      
      toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando para o dashboard..."
      })
      
      // Forçar redirecionamento
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)
      
    } catch (err: any) {
      console.error("Erro no login bypass:", err)
      setError(err.message || "Erro ao fazer login")
      setIsLoading(false)
    }
  }

  const handleDirectAccess = () => {
    toast({
      title: "Acessando dashboard",
      description: "Redirecionando diretamente para o dashboard..."
    })
    
    // Forçar redirecionamento via location
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Acesso Alternativo</CardTitle>
          <CardDescription>
            Esta página permite acessar o dashboard quando o login normal falha
          </CardDescription>
        </CardHeader>
        
        {user ? (
          <CardContent className="space-y-4">
            <div className="p-3 rounded-md bg-green-50 border border-green-200">
              <div className="flex items-center">
                <div className="mr-3 text-green-500">✓</div>
                <div>
                  <p className="font-medium text-green-800">Você já está autenticado!</p>
                  <p className="text-sm text-green-700">
                    Email: {user.email}<br />
                    ID: {user.id}
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleDirectAccess}
              className="w-full"
            >
              Acessar Dashboard Diretamente
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                />
              </div>
              
              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200" role="alert">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <span className="text-red-600">{error}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar e Acessar Dashboard"}
              </Button>
              <Link href="/login" className="text-blue-600 hover:underline text-center">
                Voltar para o login normal
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
} 