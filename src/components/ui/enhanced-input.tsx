
import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ className, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    // Filter out conflicting animation and drag properties
    const {
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      onTransitionEnd,
      onDrag,
      onDragEnd,
      onDragStart,
      ...motionProps
    } = props;

    return (
      <div className="relative">
        <motion.input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
            isFocused && "border-red-400 shadow-lg shadow-red-500/20",
            className
          )}
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true)
            motionProps.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            motionProps.onBlur?.(e)
          }}
          whileFocus={{ scale: 1.02 }}
          {...motionProps}
        />
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 -z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    )
  }
)
EnhancedInput.displayName = "EnhancedInput"

export { EnhancedInput }
