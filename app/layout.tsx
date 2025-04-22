import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProgressProvider } from "@/contexts/user-progress-context"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Insta Calendar",
  description: "Gerencie seu conteúdo de redes sociais de forma eficiente",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <UserProgressProvider>{children}</UserProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}