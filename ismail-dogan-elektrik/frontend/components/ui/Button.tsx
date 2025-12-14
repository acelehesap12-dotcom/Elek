"use client";

import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "amber" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glowEffect?: boolean;
  fullWidth?: boolean;
}

const buttonVariants = {
  primary: [
    "bg-gradient-to-r from-neon-blue-600 to-neon-blue-500",
    "text-white",
    "hover:from-neon-blue-500 hover:to-neon-blue-400",
    "hover:shadow-neon-blue",
    "active:from-neon-blue-700 active:to-neon-blue-600",
  ].join(" "),
  secondary: [
    "bg-cyber-dark-800",
    "text-gray-100",
    "border border-cyber-dark-600",
    "hover:bg-cyber-dark-700 hover:border-cyber-dark-500",
    "active:bg-cyber-dark-900",
  ].join(" "),
  outline: [
    "bg-transparent",
    "text-neon-blue-400",
    "border-2 border-neon-blue-500",
    "hover:bg-neon-blue-500/10 hover:text-neon-blue-300",
    "active:bg-neon-blue-500/20",
  ].join(" "),
  ghost: [
    "bg-transparent",
    "text-gray-300",
    "hover:bg-cyber-dark-800 hover:text-white",
    "active:bg-cyber-dark-700",
  ].join(" "),
  amber: [
    "bg-gradient-to-r from-amber-alert-600 to-amber-alert-500",
    "text-white",
    "hover:from-amber-alert-500 hover:to-amber-alert-400",
    "hover:shadow-neon-amber",
    "active:from-amber-alert-700 active:to-amber-alert-600",
  ].join(" "),
  danger: [
    "bg-gradient-to-r from-red-600 to-red-500",
    "text-white",
    "hover:from-red-500 hover:to-red-400",
    "active:from-red-700 active:to-red-600",
  ].join(" "),
};

const sizeVariants = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
  xl: "px-10 py-5 text-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      glowEffect = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          "relative inline-flex items-center justify-center gap-2",
          "font-display font-semibold uppercase tracking-wider",
          "rounded-cyber transition-all duration-300 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-neon-blue-500/50 focus:ring-offset-2 focus:ring-offset-cyber-dark-950",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          "hover:scale-[1.02] active:scale-[0.98]",
          // Clip path for cyber effect
          "[clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]",
          // Variant styles
          buttonVariants[variant],
          // Size styles
          sizeVariants[size],
          // Conditional styles
          glowEffect && "animate-pulse-glow",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {/* Hover overlay */}
        <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 [clip-path:inherit]" />

        {/* Content */}
        <span className="relative flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {loadingText || children}
            </>
          ) : (
            <>
              {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
              {children}
              {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
            </>
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

// Motion Button variant for animated interactions
export interface MotionButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "amber" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  glowEffect?: boolean;
  fullWidth?: boolean;
}

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      glowEffect = false,
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2",
          "font-display font-semibold uppercase tracking-wider",
          "rounded-cyber transition-colors duration-300",
          "focus:outline-none focus:ring-2 focus:ring-neon-blue-500/50",
          "[clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]",
          buttonVariants[variant],
          sizeVariants[size],
          glowEffect && "animate-pulse-glow",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

MotionButton.displayName = "MotionButton";

// Icon Button variant
export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, icon, variant = "ghost", size = "md", disabled, ...props },
    ref
  ) => {
    const iconSizes = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-lg",
          "transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-neon-blue-500/50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "hover:scale-105 active:scale-95",
          buttonVariants[variant],
          iconSizes[size],
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default Button;
