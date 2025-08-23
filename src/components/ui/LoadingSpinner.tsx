/**
 * ✅ LoadingSpinner.tsx
 *
 * 🔹 Composant de chargement animé avec variantes :
 *   - "boutique" : logo Riziky Boutic 3D entouré d’un anneau rotatif premium.
 *   - "elegant", "premium", "default" restent disponibles.
 * 🔹 Le spinner (cercle animé) tourne directement autour du logo (effet luxe).
 */

import React from "react";
import { Loader2, Sparkles } from "lucide-react";

// ✅ Importation du logo Riziky Boutic 3D
import logo from "@/assets/logo.png";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "boutique" | "elegant" | "premium";
  message?: string;
  submessage?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "lg",
  variant = "boutique",
  message = "Chargement...",
  submessage,
}) => {
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    xl: "h-40 w-40",
  };

  const logoSizes = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-20 w-20",
    xl: "h-28 w-28",
  };

  const containerClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-20",
    xl: "py-24",
  };

  // 🔴 VARIANTE BOUTIQUE avec logo 3D entouré par un anneau luxueux
  if (variant === "boutique") {
    return (
      <div
        className={`text-center ${containerClasses[size]} relative overflow-hidden`}
      >
        {/* Effets de fond luxueux */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/30 via-pink-50/30 to-rose-50/30 dark:from-red-950/10 dark:via-pink-950/10 dark:to-rose-950/10" />
        <div className="absolute top-8 left-8 w-28 h-28 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-12 w-24 h-24 bg-gradient-to-br from-rose-200/30 to-red-200/30 rounded-full blur-2xl" />

        <div className="relative flex flex-col items-center justify-center">
          {/* ✅ Conteneur du logo + spinner */}
          <div className={`relative ${sizeClasses[size]} flex items-center justify-center mb-6`}>
            {/* Cercle rotatif autour du logo */}
            <div
              className={`absolute inset-0 rounded-full border-4 border-t-red-500 border-red-200/40 animate-spin`}
            ></div>

            {/* Logo au centre */}
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full p-3 shadow-2xl border border-red-200/50 dark:border-red-800/50">
              <img
                src={logo}
                alt="Riziky Boutic Logo"
                className={`${logoSizes[size]} object-contain`}
              />
            </div>
          </div>

          {/* Message principal */}
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-3 animate-fade-in">
            {message}
          </h2>

          {/* Sous-message */}
          {submessage && (
            <p className="text-gray-600 dark:text-gray-300 font-medium animate-fade-in">
              {submessage}
            </p>
          )}

          {/* Petits points animés */}
          <div className="flex justify-center space-x-2 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 🔵 VARIANTE ELEGANT
  if (variant === "elegant") {
    return (
      <div className={`text-center ${containerClasses[size]} relative`}>
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-20 animate-pulse"></div>
          <Loader2
            className={`${logoSizes[size]} animate-spin text-blue-600 dark:text-blue-400 relative z-10`}
          />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
          {message}
        </h3>
        {submessage && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {submessage}
          </p>
        )}
      </div>
    );
  }

  // 🟡 VARIANTE PREMIUM
  if (variant === "premium") {
    return (
      <div
        className={`text-center ${containerClasses[size]} relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-yellow-50/50 to-orange-50/50 dark:from-amber-950/20 dark:via-yellow-950/20 dark:to-orange-950/20" />

        <div className="relative">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-md opacity-40 animate-pulse"></div>
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-4 shadow-xl border border-amber-200/50 dark:border-amber-800/50">
                <Sparkles
                  className={`${logoSizes[size]} text-amber-500 animate-pulse`}
                />
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
            {message}
          </h2>

          {submessage && (
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              {submessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ⚪ VARIANTE PAR DÉFAUT
  return (
    <div className={`text-center ${containerClasses[size]}`}>
      <Loader2
        className={`${logoSizes[size]} animate-spin text-primary mx-auto mb-4`}
      />
      <h3 className="text-lg font-medium text-foreground">{message}</h3>
      {submessage && (
        <p className="mt-2 text-sm text-muted-foreground">{submessage}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
