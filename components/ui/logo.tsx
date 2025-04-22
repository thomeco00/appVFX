import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ size = "md", className }: LogoProps) {
  // Tamanhos ajustados para garantir visibilidade completa
  const sizes = {
    sm: {
      container: "h-8 w-8",
      innerCircle: "h-6 w-6",
      icon: "text-xs",
    },
    md: {
      container: "h-10 w-10",
      innerCircle: "h-8 w-8",
      icon: "text-sm",
    },
    lg: {
      container: "h-20 w-20", // Aumentado significativamente
      innerCircle: "h-16 w-16", // Aumentado proporcionalmente
      icon: "text-lg", // Aumentado o tamanho do texto
    },
  }

  return (
    <div
      className={cn(
        "rounded-full bg-white shadow-md flex items-center justify-center",
        sizes[size].container,
        className,
      )}
    >
      <div
        className={cn("rounded-full bg-blue-500 flex items-center justify-center text-white", sizes[size].innerCircle)}
      >
        {/* Ajuste fino para centralizar o símbolo de play */}
        <span
          className={cn(sizes[size].icon, "inline-flex items-center justify-center translate-x-[1px]")}
          style={{ marginTop: "-1px" }}
        >
          ▶
        </span>
      </div>
    </div>
  )
}

