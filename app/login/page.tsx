"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Logo } from "@/components/ui/logo"
import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-white">
      {/* Fundo com ondas fluidas */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Versão para desktop */}
        <div className="hidden md:block absolute inset-0">
          {/* Primeira camada de onda - mais escura */}
          <motion.div
            className="absolute inset-0 opacity-20"
            initial={{ y: 0 }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
          >
            <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
              <motion.path
                d="M0,192 C173,100 400,50 720,198 C1040,346 1280,100 1440,192 L1440,800 L0,800 Z"
                fill="#1e70f7"
                fillOpacity="0.7"
                initial={{ d: "M0,192 C173,100 400,50 720,198 C1040,346 1280,100 1440,192 L1440,800 L0,800 Z" }}
                animate={{
                  d: [
                    "M0,192 C173,100 400,50 720,198 C1040,346 1280,100 1440,192 L1440,800 L0,800 Z",
                    "M0,150 C173,250 400,150 720,250 C1040,350 1280,250 1440,150 L1440,800 L0,800 Z",
                    "M0,192 C173,100 400,50 720,198 C1040,346 1280,100 1440,192 L1440,800 L0,800 Z",
                  ],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            </svg>
          </motion.div>

          {/* Segunda camada de onda - tom médio */}
          <motion.div
            className="absolute inset-0 opacity-15"
            initial={{ y: 0 }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
          >
            <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
              <motion.path
                d="M0,250 C173,200 400,300 720,250 C1040,200 1280,300 1440,250 L1440,800 L0,800 Z"
                fill="#358eff"
                fillOpacity="0.6"
                initial={{ d: "M0,250 C173,200 400,300 720,250 C1040,200 1280,300 1440,250 L1440,800 L0,800 Z" }}
                animate={{
                  d: [
                    "M0,250 C173,200 400,300 720,250 C1040,200 1280,300 1440,250 L1440,800 L0,800 Z",
                    "M0,300 C173,150 400,200 720,300 C1040,400 1280,150 1440,300 L1440,800 L0,800 Z",
                    "M0,250 C173,200 400,300 720,250 C1040,200 1280,300 1440,250 L1440,800 L0,800 Z",
                  ],
                }}
                transition={{
                  duration: 25,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            </svg>
          </motion.div>

          {/* Terceira camada de onda - mais clara */}
          <motion.div
            className="absolute inset-0 opacity-10"
            initial={{ y: 0 }}
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
          >
            <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
              <motion.path
                d="M0,350 C173,300 400,400 720,350 C1040,300 1280,400 1440,350 L1440,800 L0,800 Z"
                fill="#19b0ff"
                fillOpacity="0.5"
                initial={{ d: "M0,350 C173,300 400,400 720,350 C1040,300 1280,400 1440,350 L1440,800 L0,800 Z" }}
                animate={{
                  d: [
                    "M0,350 C173,300 400,400 720,350 C1040,300 1280,400 1440,350 L1440,800 L0,800 Z",
                    "M0,400 C173,350 400,250 720,400 C1040,550 1280,350 1440,400 L1440,800 L0,800 Z",
                    "M0,350 C173,300 400,400 720,350 C1040,300 1280,400 1440,350 L1440,800 L0,800 Z",
                  ],
                }}
                transition={{
                  duration: 30,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Versão otimizada para mobile - mais vibrante e com ondas mais visíveis */}
        <div className="md:hidden absolute inset-0">
          {/* Gradiente de fundo para mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white"></div>

          {/* Primeira onda mobile - mais escura e mais próxima */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[70vh]"
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
          >
            <svg className="w-full h-full" viewBox="0 0 390 500" preserveAspectRatio="none">
              <motion.path
                d="M0,150 C65,100 130,180 195,150 C260,120 325,180 390,150 L390,500 L0,500 Z"
                fill="#1e70f7"
                fillOpacity="0.25"
                initial={{ d: "M0,150 C65,100 130,180 195,150 C260,120 325,180 390,150 L390,500 L0,500 Z" }}
                animate={{
                  d: [
                    "M0,150 C65,100 130,180 195,150 C260,120 325,180 390,150 L390,500 L0,500 Z",
                    "M0,180 C65,150 130,100 195,180 C260,260 325,150 390,180 L390,500 L0,500 Z",
                    "M0,150 C65,100 130,180 195,150 C260,120 325,180 390,150 L390,500 L0,500 Z",
                  ],
                }}
                transition={{
                  duration: 12,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            </svg>
          </motion.div>

          {/* Segunda onda mobile - tom médio */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[60vh]"
            initial={{ y: 0 }}
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
          >
            <svg className="w-full h-full" viewBox="0 0 390 500" preserveAspectRatio="none">
              <motion.path
                d="M0,200 C65,170 130,230 195,200 C260,170 325,230 390,200 L390,500 L0,500 Z"
                fill="#358eff"
                fillOpacity="0.3"
                initial={{ d: "M0,200 C65,170 130,230 195,200 C260,170 325,230 390,200 L390,500 L0,500 Z" }}
                animate={{
                  d: [
                    "M0,200 C65,170 130,230 195,200 C260,170 325,230 390,200 L390,500 L0,500 Z",
                    "M0,230 C65,200 130,150 195,230 C260,310 325,200 390,230 L390,500 L0,500 Z",
                    "M0,200 C65,170 130,230 195,200 C260,170 325,230 390,200 L390,500 L0,500 Z",
                  ],
                }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            </svg>
          </motion.div>

          {/* Terceira onda mobile - mais clara e mais próxima do usuário */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[50vh]"
            initial={{ y: 0 }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
          >
            <svg className="w-full h-full" viewBox="0 0 390 500" preserveAspectRatio="none">
              <motion.path
                d="M0,250 C65,220 130,280 195,250 C260,220 325,280 390,250 L390,500 L0,500 Z"
                fill="#19b0ff"
                fillOpacity="0.35"
                initial={{ d: "M0,250 C65,220 130,280 195,250 C260,220 325,280 390,250 L390,500 L0,500 Z" }}
                animate={{
                  d: [
                    "M0,250 C65,220 130,280 195,250 C260,220 325,280 390,250 L390,500 L0,500 Z",
                    "M0,280 C65,250 130,200 195,280 C260,360 325,250 390,280 L390,500 L0,500 Z",
                    "M0,250 C65,220 130,280 195,250 C260,220 325,280 390,250 L390,500 L0,500 Z",
                  ],
                }}
                transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="relative flex flex-col items-center z-10 w-full max-w-md">
        <div className="mb-6">
          <Logo size="lg" />
        </div>
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

