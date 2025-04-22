"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Save } from "lucide-react"

// Target audience options
const targetAudiences = [
  { id: "jovens", label: "Jovens", color: "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200" },
  { id: "adultos", label: "Adultos", color: "bg-pink-100 hover:bg-pink-200 text-pink-800 border-pink-200" },
  { id: "idosos", label: "Idosos", color: "bg-green-100 hover:bg-green-200 text-green-800 border-green-200" },
  {
    id: "profissionais",
    label: "Profissionais",
    color: "bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200",
  },
  {
    id: "estudantes",
    label: "Estudantes",
    color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200",
  },
  { id: "empresas", label: "Empresas", color: "bg-teal-100 hover:bg-teal-200 text-teal-800 border-teal-200" },
]

// Age range options
const ageRanges = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]

export default function CreatePersona() {
  const [personaName, setPersonaName] = useState("")
  const [age, setAge] = useState("")
  const [interests, setInterests] = useState("")
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([])
  const [avatarColor, setAvatarColor] = useState("#6366f1") // Default color
  const [initials, setInitials] = useState("P")

  // Generate avatar color and initials based on persona name
  useEffect(() => {
    if (personaName) {
      // Generate initials from name
      const words = personaName.trim().split(" ")
      if (words.length >= 2) {
        setInitials(`${words[0][0]}${words[1][0]}`.toUpperCase())
      } else if (words[0]) {
        setInitials(words[0][0].toUpperCase())
      }

      // Generate a color based on the name (simple hash function)
      const hash = personaName.split("").reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc)
      }, 0)

      // Convert to HSL for pastel colors (high lightness, medium saturation)
      const h = Math.abs(hash % 360)
      const s = 70 // Medium saturation
      const l = 80 // High lightness for pastel
      setAvatarColor(`hsl(${h}, ${s}%, ${l}%)`)
    } else {
      setInitials("P")
      setAvatarColor("#6366f1")
    }
  }, [personaName])

  // Toggle audience selection
  const toggleAudience = (audienceId: string) => {
    if (selectedAudiences.includes(audienceId)) {
      setSelectedAudiences(selectedAudiences.filter((id) => id !== audienceId))
    } else {
      setSelectedAudiences([...selectedAudiences, audienceId])
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the persona data
    console.log({
      name: personaName,
      age,
      interests,
      targetAudiences: selectedAudiences,
    })
    alert("Persona salva com sucesso!")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4 text-gray-600 hover:text-gray-900 p-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o painel
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Criar Nova Persona</h1>
          <p className="text-gray-500 mt-1">Defina as características da sua persona de marketing</p>
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <Avatar className="w-32 h-32 text-3xl font-bold" style={{ backgroundColor: avatarColor }}>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Avatar gerado automaticamente
                  <br />
                  baseado no nome da persona
                </p>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="flex-1 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-base">
                      Nome da Persona
                    </Label>
                    <Input
                      id="name"
                      value={personaName}
                      onChange={(e) => setPersonaName(e.target.value)}
                      placeholder="Ex: Maria Empreendedora"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="age" className="text-base">
                      Idade
                    </Label>
                    <Select value={age} onValueChange={setAge} required>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione a faixa etária" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range} anos
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="interests" className="text-base">
                      Interesses
                    </Label>
                    <Textarea
                      id="interests"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="Ex: Marketing digital, empreendedorismo, tecnologia"
                      className="mt-1 resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-base mb-2 block">Público-alvo</Label>
                    <div className="flex flex-wrap gap-2">
                      {targetAudiences.map((audience) => (
                        <Button
                          key={audience.id}
                          type="button"
                          variant="outline"
                          className={`${audience.color} border transition-all ${
                            selectedAudiences.includes(audience.id) ? "ring-2 ring-offset-1" : ""
                          }`}
                          onClick={() => toggleAudience(audience.id)}
                        >
                          {audience.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" className="text-gray-600">
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Persona
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

