"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import AppLayout from "@/components/layout/app-layout"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  ChevronLeft,
  Save,
  CheckCircle2,
  Building2,
  MapPin,
  Store,
  Users,
  Target,
  Calendar,
  ArrowLeft,
  Home,
  ArrowRight,
} from "lucide-react"
import { useUserProgress } from "@/contexts/user-progress-context"

// Define the questions and options
const questions = [
  {
    id: 1,
    question: "Nome da empresa",
    type: "text",
    placeholder: "Ex: Brechó Calu",
    icon: <Building2 className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 2,
    question: "Qual é o ramo de atuação da sua empresa?",
    type: "text",
    placeholder: "Ex: Moda, Tecnologia",
    icon: <Building2 className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 3,
    question: "Onde sua empresa está localizada?",
    type: "text",
    placeholder: "Ex: São Paulo, Rio de Janeiro",
    icon: <MapPin className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 4,
    question: "Seu negócio é digital, físico ou híbrido?",
    type: "options",
    options: [
      { id: "digital", text: "Digital", color: "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200" },
      { id: "fisico", text: "Físico", color: "bg-green-100 hover:bg-green-200 text-green-800 border-green-200" },
      { id: "hibrido", text: "Híbrido", color: "bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200" },
    ],
    icon: <Store className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 5,
    question: "Quem é seu público principal?",
    type: "options",
    options: [
      { id: "jovem", text: "Jovem", color: "bg-pink-100 hover:bg-pink-200 text-pink-800 border-pink-200" },
      { id: "adulto", text: "Adulto", color: "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200" },
      { id: "idoso", text: "Idoso", color: "bg-teal-100 hover:bg-teal-200 text-teal-800 border-teal-200" },
      { id: "variado", text: "Variado", color: "bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border-indigo-200" },
    ],
    icon: <Users className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 6,
    question: "Qual a linguagem para se comunicar com o público?",
    type: "options",
    options: [
      { id: "formal", text: "Formal", color: "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200" },
      {
        id: "tecnica",
        text: "Técnica/Especializada",
        color: "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200",
      },
      {
        id: "casual",
        text: "Casual/Descontraída",
        color: "bg-green-100 hover:bg-green-200 text-green-800 border-green-200",
      },
      {
        id: "jovem",
        text: "Jovem/Moderna",
        color: "bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200",
      },
    ],
    icon: <Users className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 7,
    question: "Qual o objetivo principal da sua estratégia de conteúdo?",
    type: "options",
    options: [
      { id: "informar", text: "Informar", color: "bg-cyan-100 hover:bg-cyan-200 text-cyan-800 border-cyan-200" },
      { id: "vender", text: "Vender", color: "bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200" },
      { id: "engajar", text: "Engajar", color: "bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-200" },
      {
        id: "fidelizar",
        text: "Fidelizar",
        color: "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-200",
      },
    ],
    icon: <Target className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 8,
    question: "Existem datas especiais ou eventos importantes para sua empresa?",
    type: "textarea",
    placeholder: "Ex: Aniversário da empresa, lançamentos sazonais",
    icon: <Calendar className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 9,
    question: "Qual a dor dos seus clientes que seu produto/serviço resolve?",
    type: "textarea",
    placeholder: "Descreva o problema que seus clientes enfrentam",
    description: "Pense no benefício principal que você oferece.",
    icon: <Target className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 10,
    question: "Quais são os valores principais da sua empresa?",
    type: "textarea",
    placeholder: "Ex: Sustentabilidade, inovação, qualidade",
    icon: <Building2 className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 11,
    question: "Descreva brevemente os principais produtos ou serviços oferecidos",
    type: "textarea",
    placeholder: "Descreva seus produtos ou serviços principais",
    icon: <Store className="h-5 w-5 text-blue-500" />,
  },
]

// Motivational messages based on progress
const motivationalMessages = [
  "Vamos começar!",
  "Ótimo progresso!",
  "Continue assim!",
  "Estamos avançando!",
  "Quase lá!",
  "Mais algumas perguntas!",
  "Você está indo muito bem!",
  "Informações valiosas!",
  "Quase finalizando!",
  "Últimos detalhes!",
  "Último passo!",
]

export default function CompanyProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { completeCompanyProfile, companyProfileCompleted } = useUserProgress()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [progress, setProgress] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [textValue, setTextValue] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Check if we're in edit mode
  useEffect(() => {
    const edit = searchParams.get("edit")
    if (edit === "true") {
      setIsEditing(true)

      // In a real app, you would load the saved answers here
      // For now, we'll just simulate some saved data
      setAnswers({
        1: "Brechó Calu",
        2: "Moda Sustentável",
        3: "São Paulo",
        4: "hibrido",
        5: "adulto",
        6: "casual",
        7: "engajar",
        8: "Aniversário da loja em outubro, Black Friday, Semana da Moda Sustentável",
        9: "Dificuldade em encontrar peças exclusivas e de qualidade a preços acessíveis, além da preocupação com o impacto ambiental da indústria da moda.",
        10: "Sustentabilidade, qualidade, exclusividade, preço justo, transparência",
        11: "Roupas, acessórios e calçados de segunda mão em excelente estado. Peças vintage e exclusivas. Consultoria de estilo sustentável.",
      })
    }
  }, [searchParams])

  // Update progress when current question changes
  useEffect(() => {
    setProgress((currentQuestion / questions.length) * 100)
  }, [currentQuestion])

  // Reset text value and selected option when question changes
  useEffect(() => {
    setTextValue("")
    setSelectedOption(null)

    // If there's already an answer for this question, load it
    const currentQuestionId = questions[currentQuestion].id
    if (answers[currentQuestionId]) {
      if (questions[currentQuestion].type === "options") {
        setSelectedOption(answers[currentQuestionId])
      } else {
        setTextValue(answers[currentQuestionId])
      }
    }
  }, [currentQuestion, answers])

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
    setAnswers({ ...answers, [questions[currentQuestion].id]: optionId })
  }

  const handleTextChange = (value: string) => {
    setTextValue(value)
    setAnswers({ ...answers, [questions[currentQuestion].id]: value })
  }

  const canProceed = () => {
    const question = questions[currentQuestion]
    if (question.type === "options") {
      return selectedOption !== null
    } else {
      return textValue.trim().length > 0
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Handle completion
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleFinish = () => {
    setIsLoading(true)
    // Mark company profile as completed
    completeCompanyProfile()

    // Simulate loading
    setTimeout(() => {
      // Redirect to dashboard
      router.push("/dashboard")
    }, 1000)
  }

  const handleCompleteEditing = () => {
    setIsLoading(true)
    // Mark company profile as completed
    completeCompanyProfile()

    // Simulate loading
    setTimeout(() => {
      // Redirect to dashboard
      router.push("/dashboard")
    }, 1000)
  }

  const renderQuestionContent = () => {
    const question = questions[currentQuestion]

    if (question.type === "options") {
      return (
        <div className="space-y-3">
          {question.options.map((option) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Button
                variant="outline"
                className={`w-full p-4 justify-start text-base font-medium border-2 transition-all duration-200 ${
                  option.color
                } ${selectedOption === option.id ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent"}`}
                onClick={() => handleOptionSelect(option.id)}
              >
                {option.text}
              </Button>
            </motion.div>
          ))}
        </div>
      )
    } else if (question.type === "text") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <Input
            value={textValue}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={question.placeholder}
            className="p-4 text-base border-2 focus-visible:ring-blue-200 focus-visible:border-blue-500"
          />
        </motion.div>
      )
    } else if (question.type === "textarea") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          {question.description && <p className="text-gray-600 text-sm mb-2">{question.description}</p>}
          <Textarea
            value={textValue}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={question.placeholder}
            className="p-3 text-base border-2 min-h-[120px] focus-visible:ring-blue-200 focus-visible:border-blue-500"
          />
        </motion.div>
      )
    }

    return null
  }

  return (
    <AppLayout currentPage="company-profile">
      <div className="py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <motion.h1
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isEditing ? "Editar Resumo da Empresa" : "Resumo da Empresa"}
          </motion.h1>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-10 border-gray-300 hover:bg-gray-100 flex-1 sm:flex-none"
              onClick={() => router.push("/dashboard")}
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>

            {isEditing && (
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 h-10 flex-1 sm:flex-none"
                onClick={handleCompleteEditing}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key="company-profile-questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="w-full max-w-2xl mx-auto shadow-lg border-none overflow-hidden">
                <CardHeader className="space-y-4 pb-4">
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2 bg-blue-100">
                      <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </Progress>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-blue-500 font-medium">
                        Pergunta {currentQuestion + 1} de {questions.length}
                      </p>
                      <p className="text-sm text-gray-500">{Math.round(progress)}% completo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      {questions[currentQuestion].icon}
                    </div>
                    <CardTitle className="text-xl font-bold">{questions[currentQuestion].question}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-0">
                  {renderQuestionContent()}

                  <motion.div
                    className="text-center py-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <p className="text-lg font-medium text-blue-500">{motivationalMessages[currentQuestion]}</p>
                  </motion.div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  {currentQuestion > 0 ? (
                    <Button variant="outline" onClick={handlePrevious} className="border-gray-300 text-gray-700 h-11">
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </Button>
                  ) : (
                    <div></div> // Empty div to maintain layout with justify-between
                  )}

                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-green-500 hover:bg-green-600 text-white transition-all h-11"
                  >
                    {currentQuestion < questions.length - 1 ? (
                      <>
                        Próximo
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Finalizar
                        <Save className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="company-profile-complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="w-full max-w-2xl mx-auto shadow-lg border-none overflow-hidden">
                <CardHeader className="pb-2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-center">Resumo Concluído!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-2">
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h3 className="text-xl font-medium mb-2">Suas respostas foram salvas</h3>
                    <p className="text-gray-600 text-base">
                      Agora você pode gerar seu calendário de conteúdo com base nas informações fornecidas.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h4 className="font-medium text-lg mb-3">Resumo das informações:</h4>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 divide-y divide-gray-200">
                      {questions.slice(0, 6).map((question) => {
                        const answer = answers[question.id]
                        let displayAnswer = answer

                        if (question.type === "options") {
                          const option = question.options?.find((o) => o.id === answer)
                          displayAnswer = option?.text || answer
                        }

                        return (
                          <div key={question.id} className="py-2">
                            <p className="text-gray-600 text-sm">{question.question}</p>
                            <p className="font-medium text-base">{displayAnswer || "Não respondido"}</p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Ver mais / Ver menos toggle */}
                    <button className="mt-3 text-blue-500 text-sm font-medium flex items-center hover:underline">
                      Ver mais informações
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </button>
                  </motion.div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsComplete(false)}
                    className="border-gray-300 text-gray-700 h-12 w-full sm:w-auto order-2 sm:order-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>

                  <Button
                    onClick={handleFinish}
                    disabled={isLoading}
                    className="bg-blue-500 hover:bg-blue-600 text-white transition-all h-12 w-full sm:w-auto order-1 sm:order-2"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processando...
                      </>
                    ) : (
                      <>
                        Ir para Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  )
}

