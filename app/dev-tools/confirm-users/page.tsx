"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

// Esta página é apenas para desenvolvimento e teste
// Não deve ser exposta em produção

export default function ConfirmUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const { user, status } = useUser()
  const router = useRouter()

  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Buscar lista de usuários
  const fetchUsers = async () => {
    setLoading(true)
    setMessage("")

    try {
      // Esta função não está disponível no client SDK do Supabase
      // Usamos uma função serverless do Supabase Edge Functions
      const { data, error } = await supabase.functions.invoke('list-users', {
        body: { action: "list" }
      })

      if (error) {
        console.error("Erro ao buscar usuários:", error)
        setMessage(`Erro: ${error.message || "Falha ao buscar usuários"}`)
        return
      }

      setUsers(data?.users || [])
    } catch (err: any) {
      console.error("Exceção ao buscar usuários:", err)
      setMessage(`Erro: ${err.message || "Falha ao buscar usuários"}`)
    } finally {
      setLoading(false)
    }
  }

  // Confirmar usuário manualmente
  const confirmUser = async (userId: string) => {
    try {
      // Esta função não está disponível no client SDK do Supabase
      // Usamos uma função serverless do Supabase Edge Functions
      const { data, error } = await supabase.functions.invoke('confirm-user', {
        body: { userId }
      })

      if (error) {
        console.error("Erro ao confirmar usuário:", error)
        setMessage(`Erro: ${error.message || "Falha ao confirmar usuário"}`)
        return
      }

      setMessage("Usuário confirmado com sucesso!")
      // Atualizar a lista
      await fetchUsers()
    } catch (err: any) {
      console.error("Exceção ao confirmar usuário:", err)
      setMessage(`Erro: ${err.message || "Falha ao confirmar usuário"}`)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers()
    }
  }, [status])

  if (status !== "authenticated") {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="bg-yellow-50 border-b border-yellow-100">
          <div className="flex items-center">
            <AlertCircle className="text-yellow-500 h-6 w-6 mr-2" />
            <CardTitle>Ferramenta de Desenvolvimento - Confirmar Usuários</CardTitle>
          </div>
          <p className="text-yellow-700 text-sm mt-2">
            Esta página é apenas para desenvolvimento e teste. Não deve ser exposta em produção.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold">Usuários Não Confirmados</h2>
            <Button 
              variant="outline" 
              onClick={fetchUsers} 
              disabled={loading}
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>

          {message && (
            <div className={`p-3 mb-4 rounded-md ${message.includes("Erro") ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
              <div className="flex">
                {message.includes("Erro") ? (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                )}
                <span className={message.includes("Erro") ? "text-red-600" : "text-green-600"}>{message}</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin text-gray-400" />
              <p className="mt-2 text-gray-500">Carregando usuários...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-gray-50">
              <p className="text-gray-500">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-gray-600 border">Email</th>
                    <th className="px-4 py-2 text-left text-gray-600 border">Status</th>
                    <th className="px-4 py-2 text-left text-gray-600 border">Criado em</th>
                    <th className="px-4 py-2 text-left text-gray-600 border">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 border">{user.email}</td>
                      <td className="px-4 py-3 border">
                        <span className={`px-2 py-1 rounded-full text-xs 
                          ${user.email_confirmed_at 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'}`}>
                          {user.email_confirmed_at ? 'Confirmado' : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-4 py-3 border">{new Date(user.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 border">
                        {!user.email_confirmed_at && (
                          <Button 
                            size="sm" 
                            onClick={() => confirmUser(user.id)}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Confirmar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 