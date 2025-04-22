"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email) {
      setError("Por favor, informe seu email")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Enviando o link de redefinição de senha
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      })
      
      if (error) {
        console.error("Erro ao solicitar redefinição de senha:", error)
        setError(error.message || "Não foi possível enviar o email de redefinição")
        
        toast({
          title: "Erro ao redefinir senha",
          description: error.message || "Não foi possível enviar o email de redefinição",
          variant: "destructive",
        })
      } else {
        setEmailSent(true)
        
        toast({
          title: "Email enviado",
          description: "Por favor, verifique sua caixa de entrada para redefinir sua senha",
        })
      }
    } catch (err: any) {
      console.error("Exceção ao solicitar redefinição de senha:", err)
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
          <CardTitle className="text-2xl">Recuperar senha</CardTitle>
          <CardDescription>
            Informe seu email para receber um link de redefinição de senha
          </CardDescription>
        </CardHeader>
        
        {emailSent ? (
          <CardContent className="pt-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-100 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-green-800 mb-2">Email enviado com sucesso!</h3>
              <p className="text-green-700 mb-4">
                Enviamos um link de redefinição de senha para {email}. 
                Por favor, verifique sua caixa de entrada e spam.
              </p>
              <p className="text-sm text-green-600">
                O link expira em 24 horas. Caso não receba o email, você pode tentar novamente.
              </p>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleResetPassword}>
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
                  className={error ? "border-red-500" : ""}
                />
                
                {error && (
                  <div className="flex items-center mt-1 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar link de redefinição"}
              </Button>
              
              <Button variant="ghost" asChild className="w-full">
                <Link href="/login" className="flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para o login
                </Link>
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
} 