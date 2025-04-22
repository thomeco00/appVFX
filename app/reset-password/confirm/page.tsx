"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { AlertCircle, CheckCircle, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ConfirmResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  // Verificar se temos um hash na URL (o Supabase envia isto no link enviado por email)
  useEffect(() => {
    // O hash é atualizado pelo Supabase Auth para incluir o token
    const handleAuthStateChange = async () => {
      const { data } = await supabase.auth.getSession()
      
      // Se não tivermos uma sessão, podemos assumir que o link é inválido
      if (!data.session) {
        setError("Link inválido ou expirado. Por favor, solicite um novo link.")
      }
    }
    
    handleAuthStateChange()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validar senhas
    if (!password) {
      setError("Por favor, informe uma nova senha")
      return
    }
    
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Atualizar a senha
      const { error } = await supabase.auth.updateUser({
        password
      })
      
      if (error) {
        console.error("Erro ao redefinir senha:", error)
        setError(error.message || "Não foi possível redefinir sua senha")
        
        toast({
          title: "Erro ao redefinir senha",
          description: error.message || "Não foi possível redefinir sua senha",
          variant: "destructive",
        })
      } else {
        setIsComplete(true)
        
        toast({
          title: "Senha redefinida com sucesso",
          description: "Você pode fazer login com sua nova senha",
        })
        
        // Redirecionar para o login após 3 segundos
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err: any) {
      console.error("Exceção ao redefinir senha:", err)
      setError(err.message || "Ocorreu um erro ao processar sua solicitação")
      
      toast({
        title: "Erro inesperado",
        description: err.message || "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Redefinir sua senha</CardTitle>
          <CardDescription>
            Por favor, informe uma nova senha para sua conta
          </CardDescription>
        </CardHeader>
        
        {isComplete ? (
          <CardContent className="pt-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-100 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-green-800 mb-2">Senha redefinida com sucesso!</h3>
              <p className="text-green-700 mb-4">
                Sua senha foi alterada. Você pode fazer login com sua nova senha.
              </p>
              <p className="text-sm text-green-600">
                Redirecionando para a página de login...
              </p>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-600">{error}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className={error && password.length === 0 ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  Sua senha deve ter pelo menos 6 caracteres
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className={error && password !== confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Redefinindo senha..." : "Redefinir senha"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
} 