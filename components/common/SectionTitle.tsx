import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  accent?: string;
  align?: "left" | "center" | "right";
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  accent,
  align = "center",
}) => {
  const alignments = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div className={`flex flex-col gap-2 mb-12 animate-fade-in ${alignments[align]}`}>
      {accent && (
        <span className="font-accent text-[15px] italic tracking-[0.2em] text-mauve font-medium">
          {accent}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-obsidian tracking-wider uppercase leading-tight">
        {title}
      </h2>
      <div className="w-20 h-[2.5px] bg-gradient-to-r from-mauve to-rose-dust mt-2" />
      {subtitle && (
        <p className="text-sm md:text-base text-charcoal/90 max-w-xl font-light leading-relaxed mt-4">
          {subtitle}
        </p>
      )}
    </div>
  );
};
