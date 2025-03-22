import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#16a07c] focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0",
          "autofill:bg-white autofill:shadow-[inset_0_0_0px_1000px_white]",
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
