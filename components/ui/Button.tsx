"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "obsidian" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-mauve/30 disabled:opacity-50 disabled:pointer-events-none tracking-widest uppercase select-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-mauve to-[#764E70] text-ivory hover:shadow-[0_8px_25px_rgba(139,94,131,0.35)] border border-transparent cursor-pointer",
    secondary: "bg-gradient-to-r from-rose-dust to-[#B89498] text-obsidian hover:shadow-[0_8px_25px_rgba(201,167,171,0.35)] border border-transparent cursor-pointer",
    outline: "border border-mauve text-mauve hover:bg-mauve hover:text-ivory bg-transparent cursor-pointer",
    obsidian: "bg-obsidian text-champagne hover:bg-mauve hover:text-ivory border border-transparent cursor-pointer",
    ghost: "bg-transparent text-charcoal hover:bg-champagne/40 cursor-pointer",
  };

  const sizes = {
    sm: "px-4 py-2.5 text-[10px]",
    md: "px-6 py-3.5 text-xs",
    lg: "px-8 py-4.5 text-xs md:text-sm",
  };

  return (
    <motion.button
      whileHover={disabled || isLoading ? {} : { scale: 1.02, y: -1 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Yükleniyor...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

