// Este arquivo define a configuração de tema compartilhada para todo o aplicativo
export const themeColors = {
  primary: "#358eff", // Azul principal do logo
  primaryLight: "#19b0ff", // Azul claro
  primaryDark: "#1e70f7", // Azul escuro
  accent: "#3ec641", // Verde
  dark: "#000000", // Preto
  light: "#ffffff", // Branco
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  // Cores adicionais para elementos específicos
  warning: "#ff9800",
  success: "#3ec641",
  error: "#ef4444",
  info: "#358eff",
}

// Configuração de animações compartilhadas
export const animations = {
  transition: "all 0.2s ease-in-out",
  hover: "transform hover:scale-105 transition-all duration-200",
  buttonHover: "hover:shadow-md transition-all duration-200",
  fadeIn: "animate-fadeIn",
}

// Configuração de espaçamento e layout
export const spacing = {
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-8 md:py-12",
  card: "p-4 md:p-6",
}

// Configuração de tipografia
export const typography = {
  heading: "font-bold tracking-tight",
  body: "text-gray-600",
  small: "text-sm text-gray-500",
}

// Configuração de sombras
export const shadows = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
}

// Configuração de bordas
export const borders = {
  rounded: "rounded-lg",
  roundedFull: "rounded-full",
  subtle: "border border-gray-200",
}

