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

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [generalError, setGeneralError] = useState("")
  const { signIn, status } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  
  // Redirecionar se já estiver autenticado
  useEffect(() => {
    console.log("Status de autenticação alterado para:", status)
    if (status === 'authenticated') {
      console.log("Usuário autenticado, redirecionando para dashboard...")
      router.push('/dashboard')
    }
  }, [status, router])

  // Limpar erros quando os campos mudam
  useEffect(() => {
    setEmailError("")
    setGeneralError("")
  }, [email])

  useEffect(() => {
    setPasswordError("")
    setGeneralError("")
  }, [password])

  // Garantir que isLoading seja resetado se o status mudar
  useEffect(() => {
    if (status === 'unauthenticated' && isLoading) {
      console.log("Resetando isLoading porque status é unauthenticated")
      setIsLoading(false)
    }
  }, [status, isLoading])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Iniciando tentativa de login...")
    
    // Limpar erros anteriores
    setEmailError("")
    setPasswordError("")
    setGeneralError("")
    
    // Validação básica
    if (!email) {
      setEmailError("Por favor, informe seu email")
      return
    }
    
    if (!password) {
      setPasswordError("Por favor, informe sua senha")
      return
    }
    
    // Log antes de iniciar o carregamento
    console.log("Definindo isLoading para true")
    setIsLoading(true)
    
    try {
      // Log antes de chamar signIn
      console.log("Chamando função signIn com email:", email)
      
      // Tentar login explicitamente com try/catch
      const loginResponse = await signIn(email, password)
      console.log("Resposta do signIn:", loginResponse)
      
      // Verificar primeiro se há erro na resposta
      if (loginResponse && loginResponse.error) {
        console.error("Erro detectado na resposta:", loginResponse.error)
        
        // Extrair mensagem de erro de forma segura
        const errorMessage = loginResponse.error.message || 
                           (typeof loginResponse.error === 'string' ? loginResponse.error : 'Erro desconhecido');
        
        console.log("Mensagem de erro bruta:", errorMessage);
        
        // Definir mensagem de erro apropriada baseada no conteúdo
        if (errorMessage.toLowerCase().includes("invalid login credentials") || 
            errorMessage.toLowerCase().includes("email/password") ||
            errorMessage.toLowerCase().includes("invalid") ||
            errorMessage.toLowerCase().includes("incorrect")) {
          setPasswordError("Email ou senha incorretos. Verifique e tente novamente.")
        } else if (errorMessage.toLowerCase().includes("email not confirmed")) {
          setEmailError("Verifique seu email para ativar sua conta.")
        } else if (errorMessage.toLowerCase().includes("user not found") || 
                  errorMessage.toLowerCase().includes("no user found")) {
          setEmailError("Email não cadastrado. Crie uma conta primeiro.")
        } else {
          // Erro genérico mais amigável
          setGeneralError(errorMessage || "Não foi possível fazer login. Verifique suas credenciais.")
        }
        
        // Definindo isLoading para false em caso de erro
        setIsLoading(false)
        return;
      }
      
      // Se não houver erro, proceder com o login bem-sucedido
      console.log("Login bem-sucedido, status atual:", status)
      
      // Adicionar feedback visual mais claro para o usuário
      toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando para o dashboard...",
        duration: 3000
      })
      
      // Redirecionar imediatamente se o login foi bem-sucedido, independente do status
      if (loginResponse.data?.user) {
        console.log("Forçando redirecionamento para dashboard após login bem-sucedido")
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
      
      // Definir um timeout para garantir que o isLoading seja resetado mesmo se o redirecionamento falhar
      setTimeout(() => {
        if (isLoading) {
          console.log("Resetando estado de loading após timeout")
          setIsLoading(false)
        }
      }, 5000)
      
    } catch (error) {
      console.error("Exceção no login:", error)
      // Garantir que temos uma mensagem de erro mesmo se o erro não for do tipo esperado
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      setGeneralError("Ocorreu um erro inesperado: " + errorMessage)
      setIsLoading(false)
    }
  }

  // Componente para exibir mensagem de erro
  const ErrorMessage = ({ message, id }: { message: string, id?: string }) => {
    if (!message) return null
    
    return (
      <div className="flex items-center mt-1 text-red-500 text-sm" id={id}>
        <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
        <span>{message}</span>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Entrar</CardTitle>
        <CardDescription>Acesse sua conta para gerenciar seu calendário de conteúdo</CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin} aria-label="Formulário de login">
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
              aria-invalid={emailError ? "true" : "false"}
              aria-describedby={emailError ? "email-error" : undefined}
              className={emailError ? "border-red-500" : ""}
              autoComplete="email"
            />
            {emailError && <ErrorMessage message={emailError} id="email-error" />}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link href="/reset-password" className="text-sm text-blue-600 hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              aria-invalid={passwordError ? "true" : "false"}
              aria-describedby={passwordError ? "password-error" : undefined}
              className={passwordError ? "border-red-500" : ""}
              autoComplete="current-password"
            />
            {passwordError && <ErrorMessage message={passwordError} id="password-error" />}
          </div>
          
          {generalError && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200" role="alert">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <span className="text-red-600">{generalError}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
          <div className="text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Registre-se
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
} 