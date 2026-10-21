import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0A08] disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/20 hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] border border-orange-400/20",
        destructive:
          "bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 hover:border-rose-500/40 active:scale-[0.98]",
        outline:
          "border border-white/10 bg-[#16120F]/70 text-[#F8F5F1] hover:bg-white/[0.06] hover:border-white/20 hover:text-white active:scale-[0.98] backdrop-blur-sm",
        secondary:
          "bg-[#201A16] text-[#E8DED5] border border-white/[0.08] hover:bg-[#2A221D] hover:text-white hover:border-white/15 active:scale-[0.98]",
        ghost:
          "text-[#BDB0A4] hover:bg-white/[0.06] hover:text-[#F8F5F1] active:scale-[0.98]",
        link:
          "text-orange-400 underline-offset-4 hover:underline hover:text-orange-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8.5 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-7 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
