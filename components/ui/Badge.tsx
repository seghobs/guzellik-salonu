import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  const variants = {
    primary: "bg-mauve/5 text-mauve border-mauve/15",
    secondary: "bg-rose-dust/5 text-obsidian border-rose-dust/20",
    success: "bg-emerald-500/5 text-emerald-700 border-emerald-500/15",
    warning: "bg-amber-500/5 text-amber-600 border-amber-500/15",
    danger: "bg-rose-500/5 text-rose-600 border-rose-500/15",
    info: "bg-sky-500/5 text-sky-700 border-sky-500/15",
    neutral: "bg-charcoal/5 text-charcoal border-charcoal/15",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-[2px] text-[9px] font-bold tracking-widest uppercase border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
