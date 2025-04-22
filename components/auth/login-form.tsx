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
    if (status === 'authenticated') {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Iniciando tentativa de login...");
    
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
    console.log("Definindo isLoading para true");
    setIsLoading(true)

    try {
      // Log antes de chamar signIn
      console.log("Chamando função signIn com email:", email);
      
      // Tentar login explicitamente com try/catch
      const response = await signIn(email, password);
      console.log("Resposta do signIn:", response);
      
      if (response.error) {
        console.log("Erro de login detectado:", response.error);
        
        // Identificar o tipo de erro para mostrar mensagem apropriada
        const errorMsg = response.error.message?.toLowerCase() || '';
        console.log("Mensagem de erro:", errorMsg);
        
        if (errorMsg.includes("invalid login credentials") || 
            errorMsg.includes("email/password") ||
            errorMsg.includes("invalid") ||
            errorMsg.includes("incorrect")) {
          setPasswordError("Email ou senha incorretos. Verifique e tente novamente.")
        } else if (errorMsg.includes("email not confirmed")) {
          setEmailError("Verifique seu email para ativar sua conta.")
        } else if (errorMsg.includes("user not found") || 
                  errorMsg.includes("no user found")) {
          setEmailError("Email não cadastrado. Crie uma conta primeiro.")
        } else if (errorMsg.includes("too many")) {
          setGeneralError("Muitas tentativas de login. Tente novamente mais tarde.")
        } else if (errorMsg.includes("network")) {
          setGeneralError("Erro de conexão. Verifique sua internet e tente novamente.")
        } else {
          // Erro genérico mais amigável
          console.error("Erro de login detalhado:", response.error);
          setGeneralError("Não foi possível fazer login. Verifique suas credenciais e tente novamente.")
        }
      } else {
        console.log("Login bem-sucedido, status atual:", status);
        
        // Mostramos um toast de sucesso como feedback visual imediato
        toast({
          title: "Login bem-sucedido!",
          description: "Você será redirecionado em instantes...",
          duration: 5000
        });
      }
      
    } catch (error: any) {
      console.error("Exceção no login:", error);
      setGeneralError("Ocorreu um erro ao processar seu login. Tente novamente.")
    } finally {
      // Garantir que o loading seja desativado em todos os casos
      console.log("Finalizando tentativa de login, definindo isLoading para false");
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
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              aria-invalid={emailError ? "true" : "false"}
              aria-describedby={emailError ? "email-error" : undefined}
              className={emailError ? "border-red-500" : ""}
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              aria-invalid={passwordError ? "true" : "false"}
              aria-describedby={passwordError ? "password-error" : undefined}
              className={passwordError ? "border-red-500" : ""}
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