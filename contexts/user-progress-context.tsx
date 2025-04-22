"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserProgressContextType = {
  isFirstAccess: boolean
  companyProfileCompleted: boolean
  calendarGenerated: boolean
  showingTutorial: boolean
  completeCompanyProfile: () => void
  generateCalendar: () => void
  resetProgress: () => void
  completeFirstAccess: () => void
  setShowingTutorial: (showing: boolean) => void
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined)

export function UserProgressProvider({ children }: { children: ReactNode }) {
  const [isFirstAccess, setIsFirstAccess] = useState(true)
  const [companyProfileCompleted, setCompanyProfileCompleted] = useState(false)
  const [calendarGenerated, setCalendarGenerated] = useState(false)
  const [showingTutorial, setShowingTutorial] = useState(false)

  // Load state from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedProgress = localStorage.getItem("userProgress")
        if (storedProgress) {
          const progress = JSON.parse(storedProgress)
          setIsFirstAccess(progress.isFirstAccess ?? true)
          setCompanyProfileCompleted(progress.companyProfileCompleted ?? false)
          setCalendarGenerated(progress.calendarGenerated ?? false)
        }
      } catch (error) {
        console.error("Erro ao carregar progresso:", error)
      }
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "userProgress",
        JSON.stringify({
          isFirstAccess,
          companyProfileCompleted,
          calendarGenerated,
        }),
      )
    }
  }, [isFirstAccess, companyProfileCompleted, calendarGenerated])

  const completeCompanyProfile = () => {
    setCompanyProfileCompleted(true)
  }

  const completeFirstAccess = () => {
    setIsFirstAccess(false)
  }

  const generateCalendar = () => {
    setCalendarGenerated(true)
  }

  const resetProgress = () => {
    setIsFirstAccess(true)
    setCompanyProfileCompleted(false)
    setCalendarGenerated(false)
  }

  return (
    <UserProgressContext.Provider
      value={{
        isFirstAccess,
        companyProfileCompleted,
        calendarGenerated,
        showingTutorial,
        completeCompanyProfile,
        generateCalendar,
        resetProgress,
        completeFirstAccess,
        setShowingTutorial,
      }}
    >
      {children}
    </UserProgressContext.Provider>
  )
}

export function useUserProgress() {
  const context = useContext(UserProgressContext)
  if (context === undefined) {
    throw new Error("useUserProgress must be used within a UserProgressProvider")
  }
  return context
}

