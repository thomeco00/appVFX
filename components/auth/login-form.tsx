"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-context"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, status } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  
  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    if (!email || !password) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)

    try {
      // Tentar login
      const { error, data } = await signIn(email, password)
      
      if (error) {
        toast({
          title: "Erro de login",
          description: error.message || "Email ou senha incorretos.",
          variant: "destructive",
        })
        return
      }
      
      // Se login bem-sucedido
      toast({
        title: "Login bem-sucedido",
        description: "Redirecionando para o dashboard.",
      })
      
      // Verificar o progresso do usuário no localStorage
      const progress = localStorage.getItem("userProgress")
      
      if (!progress) {
        localStorage.setItem(
          "userProgress",
          JSON.stringify({
            companyProfileCompleted: false,
          })
        )
        router.push("/company-profile")
      } else {
        const userProgress = JSON.parse(progress)
        
        if (!userProgress.companyProfileCompleted) {
          router.push("/company-profile")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (error: any) {
      console.error("Erro durante login:", error)
      toast({
        title: "Erro de sistema",
        description: "Ocorreu um erro ao processar seu login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Entrar</CardTitle>
        <CardDescription>Acesse sua conta para gerenciar seu calendário de conteúdo</CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Esqueceu a senha?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
          <div className="text-center text-sm">
            Não tem uma conta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Registre-se
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
} 