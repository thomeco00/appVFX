"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Calendar, FileDown, Image, Video, MessageSquare, Hash } from "lucide-react"

// Sample calendar data
const generateCalendarData = () => {
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

  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1
    const type = postTypes[Math.floor(Math.random() * postTypes.length)]
    const theme = themes[Math.floor(Math.random() * themes.length)]
    const hashtags = ["#marketing", "#socialmedia", "#instapost", "#content"].slice(
      0,
      Math.floor(Math.random() * 3) + 1,
    )

    return {
      day,
      title: `${type} ${theme}`,
      description: `Conteúdo ${theme} para engajar sua audiência e aumentar o alcance da sua marca.`,
      type,
      hashtags,
      engagement: Math.floor(Math.random() * 90) + 10 + "%",
    }
  })
}

export default function CalendarView() {
  const [calendarData, setCalendarData] = useState(generateCalendarData())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleGenerateCalendar = () => {
    setCalendarData(generateCalendarData())
  }

  const handleDayClick = (day: number) => {
    setSelectedDay(day)
    setIsDialogOpen(true)
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "Foto":
        return <Image className="h-4 w-4" />
      case "Vídeo":
      case "Reels":
        return <Video className="h-4 w-4" />
      case "Carrossel":
        return <Calendar className="h-4 w-4" />
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Calendário de Conteúdo</h1>
          <p className="text-gray-600 mt-2">Planeje e visualize seu conteúdo para os próximos 30 dias</p>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleGenerateCalendar}>
              <Calendar className="mr-2 h-4 w-4" />
              Gerar Calendário
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar em PDF
            </Button>
          </div>
        </header>

        {/* Calendar Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {calendarData.map((day) => (
            <Card
              key={day.day}
              className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleDayClick(day.day)}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-lg text-gray-900">Dia {day.day}</span>
                  <Badge className={`${getPostTypeColor(day.type)} border-0`}>
                    {getPostTypeIcon(day.type)}
                    <span className="ml-1">{day.type}</span>
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{day.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Day Detail Modal */}
        {selectedDay && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-gray-900 text-white border-none max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">
                  Dia {selectedDay}: {calendarData[selectedDay - 1].title}
                </DialogTitle>
                <DialogDescription className="text-gray-300">Detalhes do conteúdo planejado</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-800 p-2 rounded-md">
                    {getPostTypeIcon(calendarData[selectedDay - 1].type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Tipo de Mídia</h4>
                    <p className="text-gray-300">{calendarData[selectedDay - 1].type}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-1">Descrição</h4>
                  <p className="text-gray-300">{calendarData[selectedDay - 1].description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-1">Hashtags</h4>
                  <div className="flex flex-wrap gap-2">
                    {calendarData[selectedDay - 1].hashtags.map((tag, index) => (
                      <Badge key={index} className="bg-indigo-800 hover:bg-indigo-700 text-white">
                        <Hash className="h-3 w-3 mr-1" />
                        {tag.replace("#", "")}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
                  <span className="text-gray-300">Engajamento estimado</span>
                  <Badge className="bg-green-600 text-white">{calendarData[selectedDay - 1].engagement}</Badge>
                </div>
              </div>

              <DialogFooter className="flex sm:justify-between gap-3">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                  Editar Conteúdo
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Salvar Alterações</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

