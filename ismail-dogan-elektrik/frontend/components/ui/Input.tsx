"use client";

import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// TEXT INPUT
// ============================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  variant?: "default" | "filled" | "floating";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      success,
      hint,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      variant = "default",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const inputType = type === "password" && showPassword ? "text" : type;

    const hasError = !!error;
    const hasSuccess = !!success;

    return (
      <div className="w-full space-y-2">
        {/* Label */}
        {label && variant !== "floating" && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium transition-colors duration-200",
              hasError
                ? "text-red-400"
                : hasSuccess
                ? "text-green-400"
                : isFocused
                ? "text-neon-blue-400"
                : "text-gray-400"
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              // Base styles
              "w-full px-4 py-3 bg-cyber-dark-900/50 backdrop-blur-sm",
              "border rounded-lg text-white placeholder-gray-500",
              "transition-all duration-300",
              "focus:outline-none",
              // Border states
              hasError
                ? "border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                : hasSuccess
                ? "border-green-500 focus:border-green-400 focus:ring-2 focus:ring-green-500/20"
                : "border-cyber-dark-600 focus:border-neon-blue-500 focus:ring-2 focus:ring-neon-blue-500/20",
              // Focus glow
              isFocused && !hasError && !hasSuccess && "shadow-inner-glow",
              // Icon padding
              leftIcon && "pl-12",
              (rightIcon || showPasswordToggle) && "pr-12",
              // Disabled state
              disabled && "opacity-50 cursor-not-allowed",
              // Filled variant
              variant === "filled" && "bg-cyber-dark-800 border-transparent",
              className
            )}
            {...props}
          />

          {/* Floating Label */}
          {label && variant === "floating" && (
            <label
              htmlFor={inputId}
              className={cn(
                "absolute left-4 pointer-events-none",
                "transition-all duration-200 ease-out",
                isFocused || props.value
                  ? "-top-2 left-2 text-xs bg-cyber-dark-900 px-2"
                  : "top-3",
                hasError
                  ? "text-red-400"
                  : hasSuccess
                  ? "text-green-400"
                  : isFocused
                  ? "text-neon-blue-400"
                  : "text-gray-500"
              )}
            >
              {label}
            </label>
          )}

          {/* Right Icon / Password Toggle / Status Icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {showPasswordToggle && type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
            {hasError && <AlertCircle className="h-5 w-5 text-red-400" />}
            {hasSuccess && <CheckCircle2 className="h-5 w-5 text-green-400" />}
            {rightIcon && !hasError && !hasSuccess && rightIcon}
          </div>

          {/* Focus border animation */}
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            initial={false}
            animate={{
              boxShadow: isFocused
                ? "0 0 0 2px rgba(0, 163, 255, 0.2)"
                : "0 0 0 0px rgba(0, 163, 255, 0)",
            }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Error / Success / Hint Messages */}
        <AnimatePresence mode="wait">
          {(error || success || hint) && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "text-sm",
                hasError
                  ? "text-red-400"
                  : hasSuccess
                  ? "text-green-400"
                  : "text-gray-500"
              )}
            >
              {error || success || hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";

// ============================================
// TEXTAREA
// ============================================

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      success,
      hint,
      maxLength,
      showCharCount = false,
      disabled,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const hasError = !!error;
    const hasSuccess = !!success;
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full space-y-2">
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "block text-sm font-medium transition-colors duration-200",
              hasError
                ? "text-red-400"
                : hasSuccess
                ? "text-green-400"
                : isFocused
                ? "text-neon-blue-400"
                : "text-gray-400"
            )}
          >
            {label}
          </label>
        )}

        {/* Textarea Container */}
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled}
            value={value}
            maxLength={maxLength}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full px-4 py-3 bg-cyber-dark-900/50 backdrop-blur-sm",
              "border rounded-lg text-white placeholder-gray-500",
              "transition-all duration-300 resize-none",
              "focus:outline-none",
              "min-h-[120px]",
              hasError
                ? "border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                : hasSuccess
                ? "border-green-500 focus:border-green-400 focus:ring-2 focus:ring-green-500/20"
                : "border-cyber-dark-600 focus:border-neon-blue-500 focus:ring-2 focus:ring-neon-blue-500/20",
              isFocused && !hasError && !hasSuccess && "shadow-inner-glow",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            {...props}
          />

          {/* Character Count */}
          {showCharCount && maxLength && (
            <div
              className={cn(
                "absolute bottom-3 right-4 text-xs",
                charCount >= maxLength ? "text-red-400" : "text-gray-500"
              )}
            >
              {charCount}/{maxLength}
            </div>
          )}
        </div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {(error || success || hint) && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "text-sm",
                hasError
                  ? "text-red-400"
                  : hasSuccess
                  ? "text-green-400"
                  : "text-gray-500"
              )}
            >
              {error || success || hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// ============================================
// SELECT
// ============================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<InputHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      options,
      placeholder = "Seçiniz...",
      disabled,
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "block text-sm font-medium transition-colors duration-200",
              hasError
                ? "text-red-400"
                : isFocused
                ? "text-neon-blue-400"
                : "text-gray-400"
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full px-4 py-3 bg-cyber-dark-900/50 backdrop-blur-sm",
              "border rounded-lg text-white",
              "transition-all duration-300 appearance-none cursor-pointer",
              "focus:outline-none",
              hasError
                ? "border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                : "border-cyber-dark-600 focus:border-neon-blue-500 focus:ring-2 focus:ring-neon-blue-500/20",
              isFocused && !hasError && "shadow-inner-glow",
              disabled && "opacity-50 cursor-not-allowed",
              !value && "text-gray-500",
              className
            )}
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-cyber-dark-900 text-white"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown Arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className={cn(
                "w-5 h-5 transition-transform duration-200",
                isFocused ? "rotate-180 text-neon-blue-400" : "text-gray-500"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Input;
