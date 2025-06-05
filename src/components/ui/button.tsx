
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden transform hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg active:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl active:shadow-md before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:from-red-700 hover:to-red-800 hover:shadow-xl",
        outline: "border-2 border-red-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:bg-red-50 hover:border-red-300 hover:text-red-700 text-red-600 dark:border-red-800 dark:bg-neutral-900/80 dark:hover:bg-red-950/50",
        secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-sm hover:from-gray-200 hover:to-gray-300 hover:shadow-md dark:from-neutral-800 dark:to-neutral-700 dark:text-white dark:hover:from-neutral-700 dark:hover:to-neutral-600",
        ghost: "hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors duration-200",
        link: "text-red-600 underline-offset-4 hover:underline hover:text-red-700 dark:text-red-400 dark:hover:text-red-300",
        gradient: "bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000",
        shine: "bg-gradient-to-r from-red-500 to-red-600 text-white overflow-hidden shadow-lg hover:shadow-xl before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
        premium: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black shadow-xl hover:shadow-2xl hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 font-bold border-2 border-yellow-300 hover:border-yellow-400",
        success: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl",
        warning: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:from-orange-600 hover:to-orange-700 hover:shadow-xl",
        info: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-full",
        xl: "h-14 rounded-xl px-10 text-lg font-bold",
        xxl: "h-16 rounded-2xl px-12 text-xl font-bold",
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
