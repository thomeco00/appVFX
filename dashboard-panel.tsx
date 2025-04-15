import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit } from "lucide-react"

// Sample persona data
const personas = [
  {
    id: 1,
    title: "Persona 1",
    status: "Não iniciada",
    description: "Cliente jovem, focado em tecnologia e inovação.",
  },
  {
    id: 2,
    title: "Persona 2",
    status: "Em progresso",
    description: "Profissional de meia-idade, busca soluções práticas.",
  },
  {
    id: 3,
    title: "Persona 3",
    status: "Concluída",
    description: "Empresa estabelecida, precisa de estratégias de crescimento.",
  },
]

// Status color mapping
const statusColors = {
  "Não iniciada": "bg-gray-100 text-gray-600",
  "Em progresso": "bg-blue-100 text-blue-600",
  Concluída: "bg-green-100 text-green-600",
}

export default function DashboardPanel() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Insta Calendar</h1>
            <p className="text-gray-500 mt-1">Gerencie suas personas de marketing</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Nova Persona
          </Button>
        </header>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <Card key={persona.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold text-gray-800">{persona.title}</CardTitle>
                  <Badge
                    variant="outline"
                    className={`${statusColors[persona.status as keyof typeof statusColors]} border-0 font-medium`}
                  >
                    {persona.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{persona.description}</p>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between items-center">
                <div className="text-sm text-gray-500">Última atualização: 3 dias atrás</div>
                <Button
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

