"use client";

import React, { forwardRef, HTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================
// CARD COMPONENT
// ============================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "glass";
  hover?: "none" | "lift" | "glow" | "border";
  padding?: "none" | "sm" | "md" | "lg";
  gradient?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      hover = "glow",
      padding = "md",
      gradient = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-cyber-dark-900/80 border border-cyber-dark-700/50",
      elevated: "bg-cyber-dark-900 shadow-lg shadow-black/20",
      outlined: "bg-transparent border-2 border-cyber-dark-600",
      glass: "bg-cyber-dark-900/40 backdrop-blur-xl border border-white/10",
    };

    const hoverEffects = {
      none: "",
      lift: "hover:-translate-y-1 hover:shadow-xl",
      glow: "hover:border-neon-blue-500/50 hover:shadow-card-hover",
      border: "hover:border-neon-blue-400",
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "relative rounded-lg overflow-hidden",
          "transition-all duration-500 ease-out",
          // Variant
          variants[variant],
          // Hover effect
          hoverEffects[hover],
          // Padding
          paddings[padding],
          className
        )}
        {...props}
      >
        {/* Gradient overlay */}
        {gradient && (
          <div className="absolute inset-0 bg-gradient-to-br from-neon-blue-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// ============================================
// MOTION CARD (Animated)
// ============================================

export interface MotionCardProps
  extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined" | "glass";
  padding?: "none" | "sm" | "md" | "lg";
  hoverScale?: number;
  glowOnHover?: boolean;
}

export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      hoverScale = 1.02,
      glowOnHover = true,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-cyber-dark-900/80 border border-cyber-dark-700/50",
      elevated: "bg-cyber-dark-900 shadow-lg shadow-black/20",
      outlined: "bg-transparent border-2 border-cyber-dark-600",
      glass: "bg-cyber-dark-900/40 backdrop-blur-xl border border-white/10",
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <motion.div
        ref={ref}
        whileHover={{
          scale: hoverScale,
          boxShadow: glowOnHover
            ? "0 25px 50px -12px rgba(0, 163, 255, 0.25)"
            : undefined,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "relative rounded-lg overflow-hidden",
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

MotionCard.displayName = "MotionCard";

// ============================================
// CARD HEADER
// ============================================

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-start justify-between gap-4", className)}
        {...props}
      >
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-display font-semibold text-white">
              {title}
            </h3>
          )}
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          {children}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

// ============================================
// CARD CONTENT
// ============================================

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("", className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

// ============================================
// CARD FOOTER
// ============================================

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, divider = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-4 mt-6",
          divider && "pt-6 border-t border-cyber-dark-700/50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

// ============================================
// FEATURE CARD
// ============================================

export interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: "blue" | "amber";
}

export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  (
    { className, icon, title, description, accent = "blue", ...props },
    ref
  ) => {
    const accentColors = {
      blue: {
        icon: "text-neon-blue-400",
        glow: "group-hover:shadow-neon-blue",
        border: "group-hover:border-neon-blue-500/50",
      },
      amber: {
        icon: "text-amber-alert-400",
        glow: "group-hover:shadow-neon-amber",
        border: "group-hover:border-amber-alert-500/50",
      },
    };

    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "group relative p-6 rounded-lg",
          "bg-cyber-dark-900/60 backdrop-blur-sm",
          "border border-cyber-dark-700/50",
          "transition-all duration-500",
          accentColors[accent].border,
          accentColors[accent].glow,
          className
        )}
        {...props}
      >
        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-lg mb-4",
            "flex items-center justify-center",
            "bg-cyber-dark-800 border border-cyber-dark-600",
            "group-hover:border-current transition-colors duration-300",
            accentColors[accent].icon
          )}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-display font-semibold text-white mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>

        {/* Hover gradient */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100",
            "bg-gradient-to-br from-current/5 to-transparent",
            "transition-opacity duration-500 pointer-events-none",
            accentColors[accent].icon
          )}
        />
      </motion.div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

// ============================================
// STAT CARD
// ============================================

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    { className, label, value, prefix, suffix, icon, trend, ...props },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cn(
          "relative p-6 rounded-lg",
          "bg-cyber-dark-900/60 backdrop-blur-sm",
          "border border-cyber-dark-700/50",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">{label}</p>
            <p className="text-3xl font-display font-bold text-white">
              {prefix}
              <span className="gradient-text">{value}</span>
              {suffix}
            </p>
            {trend && (
              <p
                className={cn(
                  "text-sm mt-2",
                  trend.positive ? "text-green-400" : "text-red-400"
                )}
              >
                {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          {icon && (
            <div className="text-neon-blue-400 opacity-50">{icon}</div>
          )}
        </div>
      </motion.div>
    );
  }
);

StatCard.displayName = "StatCard";

export default Card;
