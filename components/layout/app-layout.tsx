"use client"

import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Calendar, Home, LogOut, Menu, X } from "lucide-react"
import { Logo } from "@/components/ui/logo"

interface AppLayoutProps {
  children: ReactNode
  currentPage?: string
}

export default function AppLayout({ children, currentPage = "dashboard" }: AppLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Determine current page from pathname if not provided
  if (pathname) {
    if (pathname.includes("/dashboard")) currentPage = "dashboard"
    else if (pathname.includes("/calendar")) currentPage = "calendar"
    else if (pathname.includes("/company-profile")) currentPage = "company-profile"
  }

  // Detectar scroll para ajustar a aparência do cabeçalho mobile
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home, id: "dashboard" },
    { name: "Resumo da Empresa", href: "/company-profile", icon: Building2, id: "company-profile" },
    { name: "Calendário", href: "/calendar", icon: Calendar, id: "calendar" },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <motion.div
        className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
          <motion.div
            className="flex items-center flex-shrink-0 px-4 mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mr-2">
              <Logo size="md" />
            </div>
            <span className="text-xl font-bold">Insta Calendar</span>
          </motion.div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <Link
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-base font-medium rounded-md transition-all duration-200 ${
                    currentPage === item.id
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                      currentPage === item.id ? "text-white" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div
            className="mt-auto px-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="outline"
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 group py-3 h-auto"
              onClick={() => router.push("/login")}
            >
              <LogOut className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              Sair
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile header - Melhorado para dispositivos modernos */}
      <div
        className={`md:hidden bg-white fixed top-0 left-0 right-0 z-20 safe-top transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="mr-2">
              <Logo size="md" />
            </div>
            <span className="text-xl font-bold">Insta Calendar</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="h-12 w-12 rounded-full touch-feedback"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu - Melhorado para dispositivos modernos */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 z-30 bg-gray-900/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              className="md:hidden fixed inset-y-0 right-0 z-40 w-full max-w-xs bg-white shadow-xl safe-top safe-bottom"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <Logo size="md" />
                    </div>
                    <span className="text-xl font-bold">Menu</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeMobileMenu}
                    className="h-12 w-12 rounded-full touch-feedback"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                  <div className="space-y-2 px-3">
                    {navItems.map((item) => (
                      <motion.div key={item.name} whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          href={item.href}
                          className={`flex items-center px-4 py-4 text-base font-medium rounded-xl ${
                            currentPage === item.id
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          } touch-feedback`}
                          onClick={closeMobileMenu}
                        >
                          <item.icon
                            className={`mr-3 flex-shrink-0 h-6 w-6 ${
                              currentPage === item.id ? "text-blue-500" : "text-gray-500"
                            }`}
                          />
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </nav>

                <div className="p-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50 py-4 h-auto text-base"
                    onClick={() => {
                      closeMobileMenu()
                      router.push("/login")
                    }}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sair
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content - Ajustado para melhor experiência mobile */}
      <div className="md:pl-64 flex flex-col flex-1 w-full">
        <main className="flex-1 mt-[72px] md:mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

