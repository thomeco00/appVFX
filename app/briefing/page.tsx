"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import AppLayout from "@/components/layout/app-layout"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Save, CheckCircle2, Building2, MapPin, Store, Users, Target, Calendar } from "lucide-react"
import { useUserProgress } from "@/contexts/user-progress-context"

// Define the questions and options
const questions = [
  {
    id: 1,
    question: "Qual é o ramo de atuação da sua empresa?",
    type: "text",
    placeholder: "Ex: Moda, Tecnologia, Alimentação, Saúde...",
    icon: <Building2 className="h-5 w-5 text-[#358eff]" />,
  },
  {
    id: 2,
    question: "Onde sua empresa está localizada?",
    type: "text",
    placeholder: "Ex: São Paulo, Rio de Janeiro, Nacional, Global...",
    icon: <MapPin className="h-5 w-5 text-[#358eff]" />,
  },
  {
    id: 3,
    question: "Seu negócio é digital, físico ou híbrido?",
    type: "options",
    options: [
      { id: "digital", text: "Digital", color: "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200" },
      { id: "fisico", text: "Físico", color: "bg-green-100 hover:bg-green-200 text-green-800 border-green-200" },
      { id: "hibrido", text: "Híbrido", color: "bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200" },
    ],
    icon: <Store className="h-5 w-5 text-[#358eff]" />,
  },
  {
    id: 4,
    question: "Quem é seu público principal?",
    type: "options",
    options: [
      { id: "jovem", text: "Jovem", color: "bg-pink-100 hover:bg-pink-200 text-pink-800 border-pink-200" },
      { id: "adulto", text: "Adulto", color: "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200" },
      { id: "idoso", text: "Idoso", color: "bg-teal-100 hover:bg-teal-200 text-teal-800 border-teal-200" },
      { id: "variado", text: "Variado", color: "bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border-indigo-200" },
    ],
    icon: <Users className="h-5 w-5 text-[#358eff]" />,
  },
  {
    id: 5,
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
    icon: <Target className="h-5 w-5 text-[#358eff]" />,
  },
  {
    id: 6,
    question: "Descreva brevemente os principais produtos ou serviços oferecidos",
    type: "textarea",
    placeholder: "Descreva seus produtos ou serviços principais...",
    icon: <Store className="h-5 w-5 text-[#358eff]" />,
  },
  {
    id: 7,
    question: "Qual a frequência ideal para publicação de conteúdo?",
    type: "options",
    options: [
      { id: "diaria", text: "Diária", color: "bg-red-100 hover:bg-red-200 text-red-800 border-red-200" },
      { id: "semanal", text: "Semanal", color: "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200" },
      { id: "quinzenal", text: "Quinzenal", color: "bg-green-100 hover:bg-green-200 text-green-800 border-green-200" },
      { id: "mensal", text: "Mensal", color: "bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200" },
    ],
    icon: <Calendar className="h-5 w-5 text-[#358eff]" />,
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
  "Último passo!",
]

export default function BriefingPage() {
  const router = useRouter()
  const { completeBriefing, briefingCompleted } = useUserProgress()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [progress, setProgress] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [textValue, setTextValue] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  const handleCreatePersonas = () => {
    setIsLoading(true)
    // Mark briefing as completed
    completeBriefing()

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
                className={`w-full p-6 justify-start text-lg font-medium border-2 transition-all duration-200 ${
                  option.color
                } ${selectedOption === option.id ? "border-[#358eff] ring-2 ring-[#358eff]/20" : "border-transparent"}`}
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
            className="p-6 text-lg border-2 focus-visible:ring-[#358eff]/20 focus-visible:border-[#358eff]"
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
          <Textarea
            value={textValue}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={question.placeholder}
            className="p-4 text-lg border-2 min-h-[120px] focus-visible:ring-[#358eff]/20 focus-visible:border-[#358eff]"
          />
        </motion.div>
      )
    }

    return null
  }

  return (
    <AppLayout currentPage="briefing">
      <div className="py-8">
        <motion.h1
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Briefing Interativo
        </motion.h1>

        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key="briefing-questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="w-full max-w-2xl mx-auto shadow-lg border-none overflow-hidden">
                <CardHeader className="space-y-2">
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2 bg-[#19b0ff]/20">
                      <motion.div
                        className="h-full bg-[#358eff]"
                        initial={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </Progress>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-[#358eff] font-medium">
                        Pergunta {currentQuestion + 1} de {questions.length}
                      </p>
                      <p className="text-sm text-gray-500">{Math.round(progress)}% completo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#358eff]/10 flex items-center justify-center">
                      {questions[currentQuestion].icon}
                    </div>
                    <CardTitle className="text-2xl font-bold">{questions[currentQuestion].question}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {renderQuestionContent()}

                  <motion.div
                    className="text-center py-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <p className="text-xl font-bold text-[#358eff]">{motivationalMessages[currentQuestion]}</p>
                    <p className="text-[#358eff]/60 text-sm mt-1">Você está fazendo um ótimo trabalho!</p>
                  </motion.div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="w-full p-6 text-lg font-bold bg-[#3ec641] hover:bg-[#35b139] text-white transition-all"
                  >
                    {currentQuestion < questions.length - 1 ? (
                      <>
                        Próximo
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      <>
                        Finalizar
                        <Save className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="briefing-complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="w-full max-w-2xl mx-auto shadow-lg border-none overflow-hidden">
                <CardHeader>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="w-24 h-24 rounded-full bg-[#3ec641]/20 flex items-center justify-center">
                      <CheckCircle2 className="h-12 w-12 text-[#3ec641]" />
                    </div>
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-center">Briefing Concluído!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h3 className="text-xl font-bold mb-2">Suas respostas foram salvas</h3>
                    <p className="text-gray-600">
                      Agora você pode criar suas personas de marketing com base nas informações fornecidas.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h4 className="font-medium mb-2">Resumo do briefing:</h4>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {questions.map((question) => {
                        const answer = answers[question.id]
                        let displayAnswer = answer

                        if (question.type === "options") {
                          const option = question.options?.find((o) => o.id === answer)
                          displayAnswer = option?.text || answer
                        }

                        return (
                          <div key={question.id} className="border-b border-gray-200 pb-2">
                            <p className="text-gray-600 text-sm">{question.question}</p>
                            <p className="font-medium">{displayAnswer || "Não respondido"}</p>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleCreatePersonas}
                    disabled={isLoading}
                    className="w-full p-6 text-lg font-bold bg-[#358eff] hover:bg-[#1e70f7] text-white transition-all"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        Continuar para o Dashboard
                        <ChevronRight className="ml-2 h-5 w-5" />
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

