"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUserProgress } from "@/contexts/user-progress-context"
import { Users, PlusCircle, Edit } from "lucide-react"

export default function PersonaSelector() {
  const router = useRouter()
  const { personas } = useUserProgress()

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-3">Suas Personas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {personas.map((persona) => (
          <div key={persona.id}>
            <Card
              className={`p-4 cursor-pointer border ${
                persona.completed ? "border-green-500 bg-green-50" : "border-dashed border-gray-300 bg-gray-50"
              }`}
              onClick={() => router.push(`/personas/create?id=${persona.id}`)}
            >
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    persona.completed ? "bg-green-100 text-green-500" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {persona.completed ? <Users className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{persona.name}</p>
                  <p className="text-sm text-gray-500">
                    {persona.completed ? "Persona completa" : "Clique para configurar"}
                  </p>
                </div>
                {persona.completed && (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

