import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: string
  trendPositive?: boolean
  icon: React.ElementType
  iconColor?: string
  iconBg?: string
  className?: string
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10 border-primary/20",
  className,
}: KPICardProps) {
  return (
    <Card className={cn("border-border/50 bg-card/70 backdrop-blur-md shadow-sm hover:border-border transition-all duration-300 hover:shadow-md", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{value}</div>
          </div>
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>

        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-border/30 text-xs">
            {trend && (
              <span
                className={cn(
                  "font-medium flex items-center",
                  trendPositive ? "text-emerald-400" : "text-destructive"
                )}
              >
                {trendPositive ? (
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
                )}
                {trend}
              </span>
            )}
            {subtitle && <span className="text-muted-foreground truncate">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
