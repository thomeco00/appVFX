"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-context"
import { getCompanyProfile } from "@/lib/supabase"
import { CompanyProfile } from "@/lib/supabase"

export default function CompanyProfileSummaryPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null)
  const { user, status } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Carregar o perfil da empresa
  useEffect(() => {
    const loadCompanyProfile = async () => {
      if (user) {
        try {
          // Verificar se o progresso do usuário inclui o perfil da empresa
          const userProgress = JSON.parse(localStorage.getItem("userProgress") || "{}")
          
          if (!userProgress.companyProfileCompleted) {
            // Se o perfil não estiver concluído, redirecionar para criá-lo
            console.log("Perfil da empresa não completo, redirecionando...")
            router.push("/company-profile")
            return
          }
          
          // Carregar perfil da empresa
          const profile = await getCompanyProfile(user.id)
          
          if (!profile) {
            console.error("Erro: Perfil marcado como completo, mas não encontrado no banco de dados")
            toast({
              title: "Erro",
              description: "Não conseguimos encontrar os dados da sua empresa.",
              variant: "destructive",
            })
            router.push("/company-profile")
            return
          }
          
          setCompanyProfile(profile)
        } catch (error) {
          console.error("Erro ao carregar perfil da empresa:", error)
          toast({
            title: "Erro",
            description: "Falha ao carregar informações da empresa.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    loadCompanyProfile()
  }, [user, router, toast])

  // Função para ir para o dashboard
  const goToDashboard = () => {
    router.push("/dashboard")
  }

  // Função para editar o perfil
  const editProfile = () => {
    router.push("/company-profile")
  }

  // Mostrar mensagem de carregamento
  if (isLoading) {
    return (
      <div className="container max-w-3xl py-10">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Carregando informações da empresa</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Resumo da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {companyProfile ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-500">Nome da Empresa</h3>
                  <p className="text-lg">{companyProfile.company_name}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-500">Indústria/Setor</h3>
                  <p className="text-lg">{companyProfile.industry}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-500">Tamanho da Empresa</h3>
                  <p className="text-lg">{companyProfile.size}</p>
                </div>
                
                {companyProfile.location && (
                  <div>
                    <h3 className="font-semibold text-gray-500">Localização</h3>
                    <p className="text-lg">{companyProfile.location}</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {companyProfile.instagram_username && (
                  <div>
                    <h3 className="font-semibold text-gray-500">Instagram</h3>
                    <p className="text-lg">{companyProfile.instagram_username}</p>
                  </div>
                )}
                
                {companyProfile.website && (
                  <div>
                    <h3 className="font-semibold text-gray-500">Website</h3>
                    <p className="text-lg">{companyProfile.website}</p>
                  </div>
                )}
              </div>
              
              {companyProfile.target_audience && (
                <div>
                  <h3 className="font-semibold text-gray-500">Público-Alvo</h3>
                  <p className="text-lg">{companyProfile.target_audience}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-gray-500">Descrição da Empresa</h3>
                <p className="text-lg">{companyProfile.description}</p>
              </div>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">
              Não foi possível carregar as informações da empresa.
            </p>
          )}
          
          <div className="mt-8 rounded-lg bg-blue-50 p-4 border border-blue-100">
            <h3 className="font-medium text-lg text-blue-700 mb-2">Próximos Passos</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-center">
                <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2">✓</span>
                <span>Preencher perfil da empresa</span>
              </li>
              <li className="flex items-center">
                <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2">2</span>
                <span>Gerar seu calendário de conteúdo</span>
              </li>
              <li className="flex items-center">
                <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2">3</span>
                <span>Personalizar e exportar seu calendário</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto order-2 sm:order-1"
            onClick={editProfile}
          >
            Editar Perfil
          </Button>
          
          <Button 
            className="w-full sm:w-auto order-1 sm:order-2"
            onClick={goToDashboard}
          >
            Ir para Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 