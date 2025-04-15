"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Building2, Calendar, MessageSquare, ChevronRight, ChevronLeft, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useUserProgress } from "@/contexts/user-progress-context"
import { useRouter } from "next/navigation"

interface TutorialStep {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

export default function TutorialModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const { completeFirstAccess, companyProfileCompleted, setShowingTutorial } = useUserProgress()
  const router = useRouter()
  const [isCompleting, setIsCompleting] = useState(false)

  // Impedir que o modal seja fechado clicando fora ou com ESC se for o primeiro acesso
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && open && !isCompleting) {
      e.preventDefault()
    }
  }

  // Adicionar efeito para garantir centralização
  useEffect(() => {
    if (open) {
      // Garantir que o scroll esteja no topo quando o modal abrir
      window.scrollTo(0, 0)
      // Impedir scroll do body quando o modal estiver aberto
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const steps: TutorialStep[] = [
    {
      title: "Bem-vindo ao Insta Calendar",
      description: "Vamos guiá-lo pelos primeiros passos para criar seu calendário de conteúdo personalizado.",
      icon: <MessageSquare className="h-10 w-10" />,
      color: "bg-purple-600",
    },
    {
      title: "Preencha o Resumo da Empresa",
      description:
        "O primeiro passo é preencher o resumo da sua empresa para entendermos suas necessidades e objetivos.",
      icon: <Building2 className="h-10 w-10" />,
      color: "bg-blue-500",
    },
    {
      title: "Gere seu Calendário",
      description: "Com base nas informações da sua empresa, gere um calendário de conteúdo personalizado.",
      icon: <Calendar className="h-10 w-10" />,
      color: "bg-green-500",
    },
    {
      title: "Crie Conteúdo Relevante",
      description: "Use o calendário para criar conteúdo que engaje seu público nas redes sociais.",
      icon: <MessageSquare className="h-10 w-10" />,
      color: "bg-purple-500",
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Marcar que está completando para evitar fechamentos indesejados
      setIsCompleting(true)

      // Marcar o primeiro acesso como concluído
      completeFirstAccess()

      // Fechar o tutorial
      onOpenChange(false)
      setShowingTutorial(false)

      // Se o perfil da empresa não estiver completo, redirecionar para a página de perfil
      if (!companyProfileCompleted) {
        setTimeout(() => {
          router.push("/company-profile")
        }, 300)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Função personalizada para lidar com tentativas de fechar o modal
  const handleOpenChange = (newOpen: boolean) => {
    // Se estiver tentando fechar e não estiver no processo de completar, impedir o fechamento
    if (!newOpen && !isCompleting) {
      return
    }

    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md border-none p-0 overflow-visible"
        onPointerDownOutside={(e) => {
          // Impedir que o clique fora feche o modal
          if (!isCompleting) {
            e.preventDefault()
          }
        }}
      >
        {/* Botão de fechar reposicionado fora do conteúdo principal */}
        <div className="absolute -top-3 -right-3 z-50">
          <button
            className="rounded-full w-8 h-8 bg-white shadow-md flex items-center justify-center border border-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => (isCompleting ? onOpenChange(false) : null)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </button>
        </div>

        <div className="bg-white rounded-lg overflow-hidden">
          <DialogHeader className="pt-8 px-6 pb-0">
            <DialogTitle className="text-center text-xl font-bold">Bem-vindo ao Insta Calendar</DialogTitle>
            <DialogDescription className="text-center mt-2">
              Vamos guiá-lo pelos primeiros passos para criar seu calendário de postagens.
            </DialogDescription>
          </DialogHeader>

          <div className="py-8 px-6">
            {/* Container com altura fixa para evitar redimensionamento */}
            <div className="h-[220px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className={`${steps[currentStep].color} p-5 rounded-full text-white mb-6`}>
                    {steps[currentStep].icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{steps[currentStep].title}</h3>
                  <p className="text-gray-600 max-w-xs">{steps[currentStep].description}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center space-x-2 mt-4 mb-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentStep ? "bg-blue-500 w-6" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="flex flex-col px-6 pb-8 pt-0 gap-3">
            <div className="flex justify-between w-full">
              {currentStep > 0 ? (
                <Button type="button" variant="outline" onClick={handlePrevious} className="h-12 text-base">
                  <ChevronLeft className="mr-2 h-5 w-5" />
                  Anterior
                </Button>
              ) : (
                <div></div> // Espaço vazio para manter o layout quando não há botão "Anterior"
              )}

              <Button type="button" onClick={handleNext} className="h-12 text-base">
                {currentStep < steps.length - 1 ? (
                  <>
                    Próximo
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  "Começar"
                )}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

