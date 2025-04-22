"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { CheckCircle, Mail, ArrowRight, AlertTriangle, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function RegistrationSuccessPage() {
  const [email, setEmail] = useState<string>("")

  useEffect(() => {
    // Recuperar o email registrado do localStorage
    const registeredEmail = localStorage.getItem("registeredEmail")
    if (registeredEmail) {
      setEmail(registeredEmail)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Registro Concluído!</CardTitle>
          <CardDescription className="text-lg">
            Sua conta foi criada com sucesso
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800">Confirme seu e-mail</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Enviamos um link de confirmação para:
                </p>
                <p className="font-medium text-blue-900 mt-1 break-all">
                  {email || "seu endereço de e-mail"}
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  Por favor, verifique sua caixa de entrada (e a pasta de spam) e clique no link para ativar sua conta.
                </p>
              </div>
            </div>
          </div>

          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800">Importante!</AlertTitle>
            <AlertDescription className="text-amber-700">
              Você só conseguirá fazer login após confirmar seu e-mail através do link enviado.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Próximos passos:</h3>
            <ol className="space-y-3">
              <li className="flex items-start">
                <div className="bg-gray-200 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">1</div>
                <div>
                  <p className="text-gray-700">Verifique seu e-mail e clique no link de confirmação</p>
                  <p className="text-gray-500 text-sm mt-1">Se não receber em alguns minutos, verifique sua pasta de spam/lixo eletrônico</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-200 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">2</div>
                <div>
                  <p className="text-gray-700">Faça login com seu e-mail e senha</p>
                  <p className="text-gray-500 text-sm mt-1">Utilize os mesmos dados que você acabou de cadastrar</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-200 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">3</div>
                <div>
                  <p className="text-gray-700">Complete seu perfil para começar a usar o sistema</p>
                </div>
              </li>
            </ol>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button asChild className="w-full">
            <Link href="/login">
              Ir para a página de login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <div className="text-center text-sm text-gray-500">
            <p>Problemas para confirmar? Tente fazer login mesmo assim ou entre em contato com o suporte.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 