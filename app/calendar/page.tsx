"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  CalendarIcon,
  Download,
  Share2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  MessageSquare,
  Hash,
  CheckCircle,
  Info,
  Lightbulb,
  PenToolIcon as Tool,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { motion } from "framer-motion"
import { useUserProgress } from "@/contexts/user-progress-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Tipo para os dados do calendário
type CalendarDayData = {
  day: number
  date: string
  title: string
  description: string
  type: string
  hashtags: string[]
  engagement: string
  theme?: {
    title: string
    description: string
  }
  script?: {
    steps: string[]
    tips: string[]
  }
  howTo?: {
    tools: string[]
    instructions: string
  }
}

export default function CalendarPage() {
  const router = useRouter()
  const { companyProfileCompleted, generateCalendar, calendarGenerated } = useUserProgress()
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [showCalendar, setShowCalendar] = useState(calendarGenerated)
  const [selectedDay, setSelectedDay] = useState<CalendarDayData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Adicione estes estados logo após os estados existentes
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Estados para gerenciar a navegação entre meses
  const [availableMonths, setAvailableMonths] = useState<{ month: number; year: number }[]>([])
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0)

  // Gerar lista de meses disponíveis (do mês atual até 24 meses à frente)
  useEffect(() => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    const months = []
    for (let i = 0; i < 24; i++) {
      const month = (currentMonth + i) % 12
      const year = currentYear + Math.floor((currentMonth + i) / 12)
      months.push({ month, year })
    }

    setAvailableMonths(months)
    setCurrentMonth(months[0].month)
    setCurrentYear(months[0].year)
  }, [])

  // Funções para navegar entre meses
  const goToPreviousMonth = () => {
    if (selectedMonthIndex > 0) {
      const newIndex = selectedMonthIndex - 1
      setSelectedMonthIndex(newIndex)
      setCurrentMonth(availableMonths[newIndex].month)
      setCurrentYear(availableMonths[newIndex].year)
    }
  }

  const goToNextMonth = () => {
    if (selectedMonthIndex < availableMonths.length - 1) {
      const newIndex = selectedMonthIndex + 1
      setSelectedMonthIndex(newIndex)
      setCurrentMonth(availableMonths[newIndex].month)
      setCurrentYear(availableMonths[newIndex].year)
    }
  }

  // Estado para rastrear posts concluídos
  const [completedPosts, setCompletedPosts] = useState<number[]>([])

  // Adicione este estado logo após os outros estados no início do componente:
  const [calendarData, setCalendarData] = useState<CalendarDayData[]>([])

  // Check if company profile is completed
  const hasCompanyProfile = companyProfileCompleted

  // Substitua a função handleGenerateCalendar por esta versão melhorada:

  const handleGenerateCalendar = () => {
    if (!hasCompanyProfile) {
      router.push("/company-profile")
      return
    }

    // Iniciar o processo de carregamento
    setIsGenerating(true)
    setIsLoadingCalendar(true)
    setLoadingStep(0)
    setLoadingProgress(0)

    // Passos do processo de geração
    const steps = [
      { message: "Analisando perfil da empresa...", duration: 1500 },
      { message: "Identificando público-alvo...", duration: 2000 },
      { message: "Definindo estratégia de conteúdo...", duration: 2500 },
      { message: "Criando calendário personalizado...", duration: 3000 },
      { message: "Finalizando...", duration: 1000 },
    ]

    // Calcular o tempo total
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0)

    // Definir o progresso máximo para cada passo (em porcentagem)
    const progressPerStep = steps.map((step, index) => {
      // Reservar 5% para o passo final
      if (index === steps.length - 1) return 100

      // Distribuir os outros 95% proporcionalmente à duração de cada passo
      const previousStepsTotal = steps.slice(0, index).reduce((acc, s) => acc + s.duration, 0)
      const currentStepPercentage = ((previousStepsTotal + step.duration) / totalDuration) * 95
      return Math.round(currentStepPercentage)
    })

    // Função para animar o progresso de forma linear
    const animateProgress = (
      startTime: number,
      startProgress: number,
      endProgress: number,
      duration: number,
      onComplete: () => void,
    ) => {
      const animate = () => {
        const now = Date.now()
        const elapsed = now - startTime
        const progress = Math.min(1, elapsed / duration)

        // Calcular o progresso atual de forma linear
        const currentProgress = startProgress + (endProgress - startProgress) * progress

        // Atualizar o progresso
        setLoadingProgress(Math.round(currentProgress))

        // Continuar a animação se não estiver completa
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // Chamar o callback quando completo
          onComplete()
        }
      }

      requestAnimationFrame(animate)
    }

    // Iniciar a sequência de passos
    let currentStep = 0

    const runStep = () => {
      if (currentStep >= steps.length) {
        // Finalizar o processo
        setTimeout(() => {
          // Importante: primeiro gerar o calendário e depois atualizar os estados
          // para evitar problemas de renderização
          generateCalendar()
          
          // Inicializar os dados do calendário se necessário
          if (calendarData.length === 0) {
            setCalendarData(generateCalendarData())
          }
          
          // Atualizar os estados de UI
          setShowCalendar(true)
          setIsGenerating(false)
          setIsLoadingCalendar(false)
        }, 500)
        return
      }

      // Atualizar o passo atual
      setLoadingStep(currentStep)

      // Determinar o progresso inicial e final para este passo
      const startProgress = currentStep === 0 ? 0 : progressPerStep[currentStep - 1]
      const endProgress = progressPerStep[currentStep]

      // Animar o progresso para este passo
      animateProgress(Date.now(), startProgress, endProgress, steps[currentStep].duration, () => {
        // Avançar para o próximo passo
        currentStep++
        runStep()
      })
    }

    // Iniciar o primeiro passo
    runStep()
  }

  // Month names
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  // Sample calendar data
  const generateCalendarData = (): CalendarDayData[] => {
    const postTypes = ["Foto", "Vídeo", "Carrossel", "Reels", "Story"]
    const themes = [
      "promocional",
      "produto",
      "depoimento",
      "dica",
      "bastidores",
      "tutorial",
      "enquete",
      "novidade",
      "inspiração",
      "concurso",
    ]
    const engagementLevels = ["Baixo", "Médio", "Alto", "Muito Alto"]

    const themeDescriptions = [
      "Introduzir o conceito de moda sustentável e os benefícios de comprar em brechós.",
      "Destacar peças exclusivas e como elas podem ser combinadas no dia a dia.",
      "Mostrar o impacto positivo da moda circular no meio ambiente.",
      "Apresentar dicas de como identificar peças de qualidade em brechós.",
      "Contar a história por trás de algumas peças especiais da loja.",
    ]

    const toolsList = [
      ["Instagram", "WhatsApp"],
      ["Instagram", "Facebook"],
      ["Instagram", "TikTok"],
      ["Instagram", "Stories"],
      ["WhatsApp", "Email Marketing"],
    ]

    const instructions = [
      "Compartilhe fotos de novas peças no Instagram e forneça atendimento personalizado via WhatsApp.",
      "Crie um carrossel mostrando diferentes combinações com a mesma peça.",
      "Grave um vídeo curto mostrando o antes e depois de uma peça restaurada.",
      "Faça uma enquete nos Stories para descobrir o que os clientes estão procurando.",
      "Envie mensagens personalizadas para clientes com peças que combinam com seu estilo.",
    ]

    return Array.from({ length: 30 }, (_, i) => {
      const day = i + 1
      const date = `2023-11-${day.toString().padStart(2, "0")}`
      const type = postTypes[Math.floor(Math.random() * postTypes.length)]
      const theme = themes[Math.floor(Math.random() * themes.length)]
      const hashtags = [
        "#ModaSustentável",
        "#BrechóCalu",
        "#ModaCircular",
        "#Sustentabilidade",
        "#PeçasExclusivas",
      ].slice(0, Math.floor(Math.random() * 3) + 2)
      const engagement = engagementLevels[Math.floor(Math.random() * engagementLevels.length)]

      const themeTitle = `${theme.charAt(0).toUpperCase() + theme.slice(1)} na Moda`
      const themeDescription = themeDescriptions[Math.floor(Math.random() * themeDescriptions.length)]

      const steps = [
        "Escolha peças disponíveis na loja.",
        "Confira o estado e qualidade.",
        "Complete sua compra pelo WhatsApp.",
        "Agende a retirada ou entrega.",
        "Compartilhe sua experiência nas redes sociais.",
      ].slice(0, Math.floor(Math.random() * 3) + 2)

      const tips = [
        "Considere peças versáteis.",
        "Aproveite ofertas especiais para clientes antigos.",
        "Combine peças vintage com itens modernos.",
        "Verifique as medidas antes de comprar.",
        "Pergunte sobre a história da peça.",
      ].slice(0, Math.floor(Math.random() * 3) + 2)

      const tools = toolsList[Math.floor(Math.random() * toolsList.length)]
      const instruction = instructions[Math.floor(Math.random() * instructions.length)]

      return {
        day,
        date,
        title: `${type} de ${theme} Calu!`,
        description: `Conteúdo ${theme} para engajar sua audiência e aumentar o alcance da sua marca.`,
        type,
        hashtags,
        engagement,
        theme: {
          title: themeTitle,
          description: themeDescription,
        },
        script: {
          steps,
          tips,
        },
        howTo: {
          tools,
          instructions: instruction,
        },
      }
    })
  }

  // Substitua a linha onde calendarData é definido (const calendarData = generateCalendarData()) com:
  // Inicializar os dados do calendário apenas uma vez
  useEffect(() => {
    if (calendarData.length === 0) {
      setCalendarData(generateCalendarData())
    }
  }, [calendarData.length])

  const handleDayClick = (day: CalendarDayData) => {
    setSelectedDay(day)
    setIsDialogOpen(true)
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "Foto":
        return <ImageIcon className="h-4 w-4" />
      case "Vídeo":
        return <VideoIcon className="h-4 w-4" />
      case "Carrossel":
        return <FileText className="h-4 w-4" />
      case "Reels":
        return <VideoIcon className="h-4 w-4" />
      case "Story":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "Foto":
        return "bg-blue-100 text-blue-800"
      case "Vídeo":
        return "bg-red-100 text-red-800"
      case "Carrossel":
        return "bg-green-100 text-green-800"
      case "Reels":
        return "bg-purple-100 text-purple-800"
      case "Story":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case "Baixo":
        return "bg-gray-100 text-gray-800"
      case "Médio":
        return "bg-blue-100 text-blue-800"
      case "Alto":
        return "bg-green-100 text-green-800"
      case "Muito Alto":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    return `${day} de ${months[currentMonth]}`
  }

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case "Instagram":
        return <ImageIcon className="h-4 w-4 text-pink-500" />
      case "Facebook":
        return <Share2 className="h-4 w-4 text-blue-500" />
      case "WhatsApp":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "TikTok":
        return <VideoIcon className="h-4 w-4 text-black" />
      case "Stories":
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case "Email Marketing":
        return <FileText className="h-4 w-4 text-orange-500" />
      default:
        return <Tool className="h-4 w-4" />
    }
  }

  // Agora vamos modificar a função togglePostCompletion para não afetar outros dados
  const togglePostCompletion = (dayNumber: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation() // Evitar que o clique abra o modal de detalhes
    }

    setCompletedPosts((prev) => {
      if (prev.includes(dayNumber)) {
        return prev.filter((day) => day !== dayNumber)
      } else {
        return [...prev, dayNumber]
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Calendário de Conteúdo</h1>
        <p className="text-gray-600 mt-2">Esta página está em desenvolvimento</p>
      </div>
    </div>
  );
}

