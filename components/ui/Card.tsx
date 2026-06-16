import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverGlow?: boolean;
  glass?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverGlow = true,
  glass = false,
  padding = "md",
  ...props
}) => {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const cardStyles = `
    overflow-hidden
    rounded-sm
    transition-all
    duration-300
    ${glass ? "glass-effect" : "bg-white border border-champagne/40 shadow-[0_4px_20px_rgba(26,17,24,0.02)]"}
    ${hoverGlow ? "hover-gold-glow" : ""}
    ${paddings[padding]}
    ${className}
  `;

  return (
    <div className={cardStyles} {...props}>
      {children}
    </div>
  );
};
