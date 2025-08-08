"use client"

import { cn } from "@/lib/utils"
import { Loader2, BookOpen, Users, BarChart3 } from "lucide-react"

export default function LoadingSpinner({
  variant = "default",
  size = "md",
  className,
  text = "Đang tải...",
}) {
  const sizeClasses = {
    xs: "w-2 h-2",
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const textSizeClasses = {
    xs: "text-xs text-white-500",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        <div className="flex space-x-2">
          <div className={cn("rounded-full bg-primary animate-bounce", sizeClasses[size])} style={{ animationDelay: "0ms" }}></div>
          <div className={cn("rounded-full bg-primary animate-bounce", sizeClasses[size])} style={{ animationDelay: "150ms" }}></div>
          <div className={cn("rounded-full bg-primary animate-bounce", sizeClasses[size])} style={{ animationDelay: "300ms" }}></div>
        </div>
        {text && <p className={cn("text-muted-foreground font-medium", textSizeClasses[size])}>{text}</p>}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        <div className={cn("rounded-full bg-primary animate-pulse", sizeClasses[size])}></div>
        {text && <p className={cn("text-muted-foreground font-medium animate-pulse", textSizeClasses[size])}>{text}</p>}
      </div>
    )
  }

  if (variant === "bounce") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        <div className={cn("rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-bounce", sizeClasses[size])}></div>
        {text && <p className={cn("text-muted-foreground font-medium", textSizeClasses[size])}>{text}</p>}
      </div>
    )
  }

  if (variant === "educational") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-6", className)}>
        <div className="relative">
          <div className={cn("rounded-full border-4 border-muted animate-spin", sizeClasses[size])} style={{ borderTopColor: "hsl(var(--primary))" }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className={cn("text-primary animate-pulse",
              size === "sm" ? "w-3 h-3" :
              size === "md" ? "w-4 h-4" :
              size === "lg" ? "w-6 h-6" :
              "w-8 h-8"
            )} />
          </div>
        </div>

        <div className="flex space-x-4">
          <Users className={cn("text-muted-foreground animate-bounce", size === "sm" ? "w-4 h-4" : "w-5 h-5")} style={{ animationDelay: "0ms" }} />
          <BarChart3 className={cn("text-muted-foreground animate-bounce", size === "sm" ? "w-4 h-4" : "w-5 h-5")} style={{ animationDelay: "200ms" }} />
          <BookOpen className={cn("text-muted-foreground animate-bounce", size === "sm" ? "w-4 h-4" : "w-5 h-5")} style={{ animationDelay: "400ms" }} />
        </div>

        {text && (
          <div className="text-center space-y-2">
            <p className={cn("text-muted-foreground font-medium", textSizeClasses[size])}>{text}</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Default spinner
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className={cn("text-muted-foreground font-medium", textSizeClasses[size])}>{text}</p>}
    </div>
  )
}
