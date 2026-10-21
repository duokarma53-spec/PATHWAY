import * as React from "react"

import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>; //
  

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-white/10 bg-[#16110E]/80 px-3.5 py-2 text-sm text-[#F8F5F1] placeholder:text-[#897B70] shadow-inner transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#F8F5F1] focus-visible:outline-none focus-visible:border-orange-500/60 focus-visible:ring-2 focus-visible:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-[#120E0C]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
