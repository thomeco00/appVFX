import RegisterForm from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crie sua conta</h1>
          <p className="text-gray-600 mt-2">Comece a gerenciar seu calendário de conteúdo</p>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  )
} 