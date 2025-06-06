
import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const EnhancedCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
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
    <motion.div
      ref={ref}
      className={cn(
        "rounded-2xl border bg-card text-card-foreground shadow-xl backdrop-blur-sm bg-gradient-to-br from-white/95 to-white/90 dark:from-gray-900/95 dark:to-gray-800/90 border-white/20 dark:border-gray-700/50",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
})
EnhancedCard.displayName = "EnhancedCard"

const EnhancedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-8 pb-4", className)}
    {...props}
  />
))
EnhancedCardHeader.displayName = "EnhancedCardHeader"

const EnhancedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => {
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
    <motion.h3
      ref={ref}
      className={cn(
        "text-3xl font-bold leading-none tracking-tight bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent",
        className
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      {...motionProps}
    >
      {children}
    </motion.h3>
  )
})
EnhancedCardTitle.displayName = "EnhancedCardTitle"

const EnhancedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
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
    <motion.p
      ref={ref}
      className={cn("text-sm text-muted-foreground/80", className)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      {...motionProps}
    >
      {children}
    </motion.p>
  )
})
EnhancedCardDescription.displayName = "EnhancedCardDescription"

const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
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
    <motion.div
      ref={ref}
      className={cn("p-8 pt-4", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      {...motionProps}
    />
  )
})
EnhancedCardContent.displayName = "EnhancedCardContent"

const EnhancedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
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
    <motion.div
      ref={ref}
      className={cn("flex items-center p-8 pt-4", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      {...motionProps}
    />
  )
})
EnhancedCardFooter.displayName = "EnhancedCardFooter"

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  EnhancedCardFooter,
}
