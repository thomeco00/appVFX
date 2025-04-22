"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { CheckCircle, Mail, ArrowRight } from "lucide-react"

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
              <Mail className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Confirme seu e-mail</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada
                  e clique no link para ativar sua conta.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Próximos passos:</h3>
            <ol className="space-y-3">
              <li className="flex items-start">
                <div className="bg-gray-200 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</div>
                <div>
                  <p className="text-gray-700">Verifique seu e-mail e clique no link de confirmação</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-200 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</div>
                <div>
                  <p className="text-gray-700">Faça login com seu e-mail e senha</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-200 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</div>
                <div>
                  <p className="text-gray-700">Complete o seu perfil para começar a usar o sistema</p>
                </div>
              </li>
            </ol>
          </div>
        </CardContent>

        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/login">
              Ir para a página de login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 