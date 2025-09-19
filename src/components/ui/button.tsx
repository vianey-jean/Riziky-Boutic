
/**
 * @fileoverview Composant Button universel avec variants avancés
 * 
 * Composant bouton basé sur Radix-UI avec système de variants CVA (Class Variance Authority).
 * Inclut de nombreux styles prédéfinis et des animations 3D modernes.
 * 
 * Variants disponibles:
 * - default : Style principal avec ombre 3D
 * - destructive : Pour actions de suppression/danger
 * - outline : Bordure avec fond transparent
 * - secondary : Style secondaire subtil
 * - ghost : Transparent avec hover subtil
 * - link : Style de lien souligné
 * - gradient : Dégradé de couleurs moderne
 * - shine : Effet de brillance animé
 * 
 * Tailles disponibles:
 * - sm, default, lg, xl : Différentes tailles
 * - icon : Format carré pour icônes
 * 
 * Fonctionnalités:
 * - Support asChild (Slot pattern)
 * - Animations de translation et ombres
 * - Focus management pour accessibilité
 * - États disabled gérés automatiquement
 * 
 * @version 2.0.0
 * @author Equipe UI Riziky-Boutic
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden transform hover:-translate-y-1 active:translate-y-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)]",
        destructive: "bg-destructive text-destructive-foreground shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)]",
        outline: "border-2 border-input bg-background shadow-[0_4px_0_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.1)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.1)] hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-[0_4px_0_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.1)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.1)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-br from-primary to-purple-600 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)]",
        shine: "bg-primary text-primary-foreground overflow-hidden shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-12 rounded-md px-10 text-base",
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
