import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm flex flex-col">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary-600">
          Bem-vindo ao App VFX
        </h1>
        
        <p className="text-xl mb-8 text-center max-w-3xl">
          Sua solução para gerenciamento de calendário de conteúdo e muito mais.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link 
            href="/login" 
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Fazer Login
          </Link>
          <Link 
            href="/register" 
            className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-md font-medium hover:bg-primary-50 transition-colors"
          >
            Registrar
          </Link>
        </div>
      </div>
    </main>
  );
}