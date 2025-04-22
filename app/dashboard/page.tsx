"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import AppLayout from "@/components/layout/app-layout"
import { Building2, Calendar, ArrowRight, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import TutorialModal from "@/components/onboarding/tutorial-modal"
import { useUserProgress } from "@/contexts/user-progress-context"

export default function DashboardPage() {
  const router = useRouter()
  const { isFirstAccess, companyProfileCompleted, calendarGenerated, setShowingTutorial } = useUserProgress()
  const [showTutorial, setShowTutorial] = useState(false)

  // Show tutorial on first access
  useEffect(() => {
    if (isFirstAccess) {
      const timer = setTimeout(() => {
        setShowTutorial(true)
        setShowingTutorial(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isFirstAccess, setShowingTutorial])

  // Quando o tutorial for fechado, atualizar o contexto
  const handleTutorialChange = (open: boolean) => {
    setShowTutorial(open)
    setShowingTutorial(open)
  }

  return (
    <AppLayout currentPage="dashboard">
      <div className="py-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">Bem-vindo ao Insta Calendar</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gerencie seu conteúdo de redes sociais de forma eficiente e organizada
          </p>
        </motion.div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Company Profile Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="relative"
          >
            <Card
              className="p-8 h-full cursor-pointer overflow-hidden group border-2 border-transparent hover:border-blue-500 transition-all duration-300 flex flex-col"
              onClick={() => router.push(companyProfileCompleted ? "/company-profile?edit=true" : "/company-profile")}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 flex justify-between items-start">
                  <div className="h-16 w-16 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="h-8 w-8" />
                  </div>

                  {companyProfileCompleted && (
                    <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Concluído</span>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                  {companyProfileCompleted ? "Editar Resumo da Empresa" : "Criar Resumo da Empresa"}
                </h2>

                <p className="text-gray-600 mb-6 group-hover:text-gray-900 transition-colors duration-300 flex-grow">
                  {companyProfileCompleted
                    ? "Atualize as informações da sua empresa para melhorar seus resultados."
                    : "Preencha as informações da sua empresa para gerar um calendário personalizado."}
                </p>

                <div className="mt-auto">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white group-hover:shadow-md transition-all duration-300 group-hover:pl-6">
                    {companyProfileCompleted ? "Editar informações" : "Começar agora"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Calendar Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="relative"
          >
            <Card
              className={`p-8 h-full overflow-hidden group border-2 border-transparent transition-all duration-300 flex flex-col ${
                companyProfileCompleted ? "cursor-pointer hover:border-green-500" : "opacity-75 cursor-not-allowed"
              }`}
              onClick={() => companyProfileCompleted && router.push("/calendar")}
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 ${
                  companyProfileCompleted ? "opacity-50 group-hover:opacity-100" : "opacity-30"
                } transition-opacity duration-300`}
              ></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 flex justify-between items-start">
                  <div
                    className={`h-16 w-16 rounded-2xl bg-green-500 text-white flex items-center justify-center shadow-lg ${
                      companyProfileCompleted ? "group-hover:scale-110" : ""
                    } transition-transform duration-300`}
                  >
                    <Calendar className="h-8 w-8" />
                  </div>

                  {calendarGenerated && (
                    <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Gerado</span>
                    </div>
                  )}
                </div>

                <h2
                  className={`text-2xl font-bold mb-3 text-gray-900 ${
                    companyProfileCompleted ? "group-hover:text-green-700" : ""
                  } transition-colors duration-300`}
                >
                  {calendarGenerated ? "Ver Calendário de Conteúdo" : "Gerar Calendário de Conteúdo"}
                </h2>

                <p
                  className={`text-gray-600 mb-6 ${
                    companyProfileCompleted ? "group-hover:text-gray-900" : ""
                  } transition-colors duration-300 flex-grow`}
                >
                  {companyProfileCompleted
                    ? "Visualize e organize seu conteúdo em um calendário interativo e intuitivo."
                    : "Complete o resumo da empresa primeiro para gerar seu calendário de conteúdo."}
                </p>

                <div className="mt-auto">
                  <Button
                    className={`bg-green-500 text-white transition-all duration-300 ${
                      companyProfileCompleted
                        ? "hover:bg-green-600 group-hover:shadow-md group-hover:pl-6"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!companyProfileCompleted}
                  >
                    {calendarGenerated ? "Ver calendário" : "Gerar calendário"}
                    {companyProfileCompleted && (
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 md:p-8 text-center">
            <h3 className="text-xl font-bold mb-3">Precisa de ajuda?</h3>
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
              Se você tiver dúvidas sobre como usar o Insta Calendar, clique no botão abaixo para ver o tutorial
              novamente.
            </p>
            <Button variant="outline" className="bg-white hover:bg-gray-50" onClick={() => handleTutorialChange(true)}>
              Ver Tutorial
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Tutorial Modal */}
      <TutorialModal open={showTutorial} onOpenChange={handleTutorialChange} />
    </AppLayout>
  )
}

