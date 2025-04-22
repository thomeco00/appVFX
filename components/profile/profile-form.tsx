"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-context"
import { getUserProfile, updateUserProfile, Profile } from "@/lib/supabase"

export default function ProfileForm() {
  const { user } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    avatarUrl: "",
    bio: "",
    companyName: "",
  })

  // Carregar dados do perfil
  useEffect(() => {
    async function loadProfile() {
      if (!user) return
      
      setIsLoading(true)
      try {
        const userProfile = await getUserProfile(user.id)
        
        if (userProfile) {
          setProfile(userProfile)
          setFormData({
            fullName: userProfile.full_name || "",
            username: userProfile.username || "",
            avatarUrl: userProfile.avatar_url || "",
            bio: userProfile.bio || "",
            companyName: userProfile.company_name || "",
          })
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar seu perfil.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProfile()
  }, [user, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    setIsSaving(true)
    
    try {
      const success = await updateUserProfile(user.id, {
        full_name: formData.fullName,
        username: formData.username,
        avatar_url: formData.avatarUrl,
        bio: formData.bio,
        company_name: formData.companyName,
      })
      
      if (success) {
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram salvas com sucesso.",
        })
      } else {
        throw new Error("Falha ao atualizar perfil")
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar seu perfil.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Carregando seu perfil...</p>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={formData.avatarUrl} />
            <AvatarFallback>{getInitials(formData.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{formData.fullName || "Seu Perfil"}</CardTitle>
            <CardDescription>
              {profile?.subscription_tier === "free" ? "Plano Gratuito" : "Plano Premium"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">URL da Imagem de Perfil</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              value={formData.avatarUrl}
              onChange={handleChange}
              placeholder="https://exemplo.com/sua-foto.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Conte um pouco sobre você ou sua empresa"
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
} 