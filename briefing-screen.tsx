"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

// Define the questions and options
const questions = [
  {
    id: 1,
    question: "Quem é seu público?",
    options: [
      { id: "a", text: "Jovem", color: "bg-blue-200 hover:bg-blue-300 text-blue-800" },
      { id: "b", text: "Adulto", color: "bg-pink-200 hover:bg-pink-300 text-pink-800" },
      { id: "c", text: "Idoso", color: "bg-green-200 hover:bg-green-300 text-green-800" },
    ],
  },
  {
    id: 2,
    question: "Qual o objetivo principal?",
    options: [
      { id: "a", text: "Informar", color: "bg-purple-200 hover:bg-purple-300 text-purple-800" },
      { id: "b", text: "Vender", color: "bg-orange-200 hover:bg-orange-300 text-orange-800" },
      { id: "c", text: "Entreter", color: "bg-teal-200 hover:bg-teal-300 text-teal-800" },
    ],
  },
  {
    id: 3,
    question: "Qual o tom de comunicação?",
    options: [
      { id: "a", text: "Formal", color: "bg-indigo-200 hover:bg-indigo-300 text-indigo-800" },
      { id: "b", text: "Casual", color: "bg-red-200 hover:bg-red-300 text-red-800" },
      { id: "c", text: "Divertido", color: "bg-emerald-200 hover:bg-emerald-300 text-emerald-800" },
    ],
  },
  {
    id: 4,
    question: "Qual plataforma principal?",
    options: [
      { id: "a", text: "Website", color: "bg-cyan-200 hover:bg-cyan-300 text-cyan-800" },
      { id: "b", text: "Redes Sociais", color: "bg-fuchsia-200 hover:bg-fuchsia-300 text-fuchsia-800" },
      { id: "c", text: "Aplicativo", color: "bg-lime-200 hover:bg-lime-300 text-lime-800" },
    ],
  },
  {
    id: 5,
    question: "Qual o prazo do projeto?",
    options: [
      { id: "a", text: "Urgente", color: "bg-rose-200 hover:bg-rose-300 text-rose-800" },
      { id: "b", text: "Médio prazo", color: "bg-amber-200 hover:bg-amber-300 text-amber-800" },
      { id: "c", text: "Flexível", color: "bg-sky-200 hover:bg-sky-300 text-sky-800" },
    ],
  },
]

// Motivational messages based on progress
const motivationalMessages = [
  "Vamos começar!",
  "Ótimo progresso!",
  "Continue assim!",
  "Quase lá!",
  "Último passo!",
  "Você conseguiu!",
]

export default function BriefingScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [progress, setProgress] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // Update progress when current question changes
  useEffect(() => {
    setProgress((currentQuestion / questions.length) * 100)
  }, [currentQuestion])

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
    setAnswers({ ...answers, [questions[currentQuestion].id]: optionId })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
    } else {
      // Handle completion - could redirect or show results
      alert("Briefing completo! Respostas: " + JSON.stringify(answers))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="space-y-2">
          <div className="space-y-2">
            <Progress value={progress} className="h-2 bg-purple-100">
              <div
                className="h-full bg-purple-500 transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </Progress>
            <p className="text-sm text-purple-500 font-medium">
              Pergunta {currentQuestion + 1} de {questions.length}
            </p>
          </div>
          <CardTitle className="text-2xl font-bold">{questions[currentQuestion].question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className={`w-full p-6 justify-start text-lg font-medium border-2 transition-all duration-200 ${
                  option.color
                } ${selectedOption === option.id ? "border-purple-500 ring-2 ring-purple-200" : "border-transparent"}`}
                onClick={() => handleOptionSelect(option.id)}
              >
                {option.text}
              </Button>
            ))}
          </div>

          <motion.div
            className="text-center py-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl font-bold text-purple-600 font-comic">{motivationalMessages[currentQuestion]}</p>
            <p className="text-purple-400 text-sm mt-1">Você está fazendo um ótimo trabalho!</p>
          </motion.div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="w-full p-6 text-lg font-bold bg-yellow-400 hover:bg-yellow-500 text-yellow-900 transition-all"
          >
            {currentQuestion < questions.length - 1 ? "Próximo" : "Finalizar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

