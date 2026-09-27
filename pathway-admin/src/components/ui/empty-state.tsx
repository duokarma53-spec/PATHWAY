import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-dashed border-border/70 bg-card/30 backdrop-blur-sm", className)}>
      <div className="h-12 w-12 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground mb-4">
        <Icon className="h-6 w-6 opacity-70" />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
      <p className="text-xs md:text-sm text-muted-foreground max-w-sm mt-1 mb-5">{description}</p>
      {actionLabel && (
        <Button onClick={onAction} size="sm" className="bg-primary text-primary-foreground font-medium rounded-full px-5">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
