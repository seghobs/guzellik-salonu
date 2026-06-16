import React from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  backgroundImage = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
}) => {
  return (
    <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Purple/Obsidian Tint Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/75 via-obsidian/85 to-ivory" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-8 animate-fade-in-up">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider uppercase">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm md:text-base text-champagne font-normal max-w-xl mx-auto mt-4 tracking-wide leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="w-12 h-[1px] bg-rose-dust/50 mx-auto mt-6" />
      </div>
    </section>
  );
};
