"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-context"
import { AlertCircle, Mail, Info } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [generalError, setGeneralError] = useState("")
  const [emailConfirmationNeeded, setEmailConfirmationNeeded] = useState(false)
  const [lastAttemptedEmail, setLastAttemptedEmail] = useState("")
  const { signIn, status } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  
  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  // Limpar erros quando os campos mudam
  useEffect(() => {
    setEmailError("")
    setGeneralError("")
    if (email !== lastAttemptedEmail) {
      setEmailConfirmationNeeded(false)
    }
  }, [email, lastAttemptedEmail])

  useEffect(() => {
    setPasswordError("")
    setGeneralError("")
  }, [password])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Limpar erros anteriores
    setEmailError("")
    setPasswordError("")
    setGeneralError("")
    setEmailConfirmationNeeded(false)
    
    // Validação básica
    if (!email) {
      setEmailError("Por favor, informe seu email")
      return
    }
    
    if (!password) {
      setPasswordError("Por favor, informe sua senha")
      return
    }
    
    setIsLoading(true)
    setLastAttemptedEmail(email)

    try {
      // Tentar login
      console.log("Iniciando tentativa de login...")
      const { error, data } = await signIn(email, password)
      
      if (error) {
        console.error("Erro detectado no login:", error)
        
        // Identificar o tipo de erro para mostrar no campo correto
        if (error.message?.toLowerCase().includes("invalid login credentials") || 
            error.message?.toLowerCase().includes("email not confirmed") || 
            error.message?.toLowerCase().includes("user not found") ||
            error.message?.toLowerCase().includes("email/password")) {
          
          let errorMessage = "Email ou senha incorretos."
          
          if (error.message.toLowerCase().includes("invalid login credentials") || 
              error.message.toLowerCase().includes("email/password")) {
            errorMessage = "Credenciais inválidas. Verifique seu email e senha."
            setPasswordError(errorMessage)
          } else if (error.message.toLowerCase().includes("email not confirmed") || 
                    error.message.toLowerCase().includes("confirm")) {
            errorMessage = "Email não confirmado. Verifique sua caixa de entrada ou spam."
            setEmailError(errorMessage)
            setEmailConfirmationNeeded(true)
          } else if (error.message.toLowerCase().includes("user not found")) {
            errorMessage = "Usuário não encontrado. Verifique seu email ou registre-se."
            setEmailError(errorMessage)
          }
          
          setGeneralError(errorMessage)
          
          toast({
            title: "Erro de login",
            description: errorMessage,
            variant: "destructive",
          })
        } else {
          // Erro genérico
          setGeneralError(error.message || "Erro durante o login")
          
          toast({
            title: "Erro de login",
            description: error.message || "Erro ao tentar fazer login",
            variant: "destructive",
          })
        }
        
        setIsLoading(false)
        return
      }
      
      // Se login bem-sucedido
      console.log("Login bem-sucedido!", data?.user)
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
      console.error("Exceção durante login:", error)
      setGeneralError("Ocorreu um erro inesperado. Tente novamente mais tarde.")
      
      toast({
        title: "Erro de sistema",
        description: "Ocorreu um erro ao processar seu login: " + (error.message || "Erro desconhecido"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Componente para exibir mensagem de erro
  const ErrorMessage = ({ message }: { message: string }) => {
    if (!message) return null
    
    return (
      <div className="flex items-center mt-1 text-red-500 text-sm">
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
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          {emailConfirmationNeeded && (
            <Alert className="bg-amber-50 border-amber-200">
              <Mail className="h-5 w-5 text-amber-600" />
              <AlertTitle className="text-amber-800">Email não confirmado</AlertTitle>
              <AlertDescription className="text-amber-700">
                Parece que você ainda não confirmou seu email. Por favor, verifique sua caixa de entrada 
                (incluindo spam/lixo eletrônico) e clique no link de confirmação que enviamos para {lastAttemptedEmail}.
              </AlertDescription>
              <div className="mt-2">
                <Button variant="outline" size="sm" className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100 hover:text-amber-900" asChild>
                  <Link href="/registration-success">
                    Ver instruções detalhadas
                  </Link>
                </Button>
              </div>
            </Alert>
          )}
          
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
              className={emailError ? "border-red-500" : ""}
            />
            <ErrorMessage message={emailError} />
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className={passwordError ? "border-red-500" : ""}
            />
            <ErrorMessage message={passwordError} />
          </div>
          
          {generalError && !emailConfirmationNeeded && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <span className="text-red-600">{generalError}</span>
              </div>
            </div>
          )}

          <div className="p-3 rounded-md bg-blue-50 border border-blue-100">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-blue-600 text-sm">
                Lembre-se: Você precisa confirmar seu email após o registro para poder fazer login.
              </span>
            </div>
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