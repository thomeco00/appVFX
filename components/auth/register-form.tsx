"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-context"
import { updateUserProfile, createUserProfile } from "@/lib/supabase"
import { AlertCircle } from "lucide-react"

export default function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signUp } = useUser()
  const { toast } = useToast()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email || !password || !fullName || !username) {
      setError("Por favor, preencha todos os campos obrigatórios.")
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    // Validação de senha
    if (password.length < 6) {
      setError("Sua senha deve ter pelo menos 6 caracteres.")
      toast({
        title: "Senha fraca",
        description: "Sua senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    console.log("Iniciando registro...")

    try {
      const { data, error } = await signUp(email, password)
      
      if (error) {
        console.error("Erro ao criar conta:", error)
        let errorMessage = error.message
        
        // Traduzir mensagens comuns de erro
        if (errorMessage.includes("already registered")) {
          errorMessage = "Este email já está registrado. Tente fazer login."
        } else if (errorMessage.includes("password")) {
          errorMessage = "A senha é muito fraca. Use pelo menos 6 caracteres."
        }
        
        setError(errorMessage)
        toast({
          title: "Erro ao criar conta",
          description: errorMessage,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      
      console.log("Conta criada com sucesso:", data)
      
      // Tentar criar perfil (mas não bloqueia o fluxo se falhar)
      if (data?.user) {
        try {
          await createUserProfile(data.user.id, {
            full_name: fullName,
            username: username,
            email: email,
          })
          
          toast({
            title: "Conta criada com sucesso!",
            description: "Por favor, verifique seu email para confirmar o cadastro antes de fazer login.",
          })
          
          // Armazenar o email registrado no localStorage para exibir na página de sucesso
          localStorage.setItem("registeredEmail", email)
          router.push("/registration-success")
        } catch (profileError) {
          console.error("Erro ao criar perfil:", profileError)
          
          toast({
            title: "Conta criada, mas atenção:",
            description: "Sua conta foi criada, mas houve um problema com seu perfil. Verifique seu email para confirmação e depois complete seu perfil.",
          })
          
          // Armazenar o email registrado no localStorage para exibir na página de sucesso
          localStorage.setItem("registeredEmail", email)
          router.push("/registration-success")
        }
      } else {
        toast({
          title: "Conta criada com sucesso",
          description: "Por favor, verifique seu email para confirmar o cadastro.",
        })
        
        // Armazenar o email registrado no localStorage para exibir na página de sucesso
        localStorage.setItem("registeredEmail", email)
        router.push("/registration-success")
      }
    } catch (error: any) {
      console.error("Exceção durante registro:", error)
      setError(error.message || "Ocorreu um erro ao criar sua conta.")
      toast({
        title: "Erro inesperado",
        description: error.message || "Ocorreu um erro ao criar sua conta.",
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
        <AlertCircle className="h-4 w-4 mr-1" />
        <span>{message}</span>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Criar Conta</CardTitle>
        <CardDescription>
          Registre-se para começar a gerenciar seu calendário de conteúdo
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Seu Nome Completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input
              id="username"
              type="text"
              placeholder="seu_usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Sua senha deve ter pelo menos 6 caracteres
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <ErrorMessage message={error} />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </Button>
          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Entrar
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
} 