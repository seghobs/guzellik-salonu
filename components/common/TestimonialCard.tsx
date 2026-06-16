import React from "react";
import { Star, Quote } from "lucide-react";
import { Card } from "../ui/Card";

interface TestimonialCardProps {
  id: string;
  ad: string; // Customer Name
  puan: number;
  yorum: string;
  tarih: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  ad,
  puan,
  yorum,
  tarih,
}) => {
  const formattedDate = new Date(tarih).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card padding="md" glass className="relative bg-white flex flex-col justify-between gap-4 h-full">
      {/* Decorative Quote Icon */}
      <div className="absolute top-4 right-4 text-rose-dust/20">
        <Quote className="w-10 h-10 transform rotate-180" />
      </div>

      <div className="flex flex-col gap-3">
        {/* Rating */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < puan ? "fill-amber-400 text-amber-400" : "text-charcoal/20"
              }`}
            />
          ))}
        </div>

        {/* Comment Text */}
        <p className="text-sm text-charcoal leading-relaxed font-normal italic">
          &ldquo;{yorum}&rdquo;
        </p>
      </div>

      {/* Author and Date */}
      <div className="flex items-center justify-between pt-2 border-t border-champagne/30 text-xs">
        <span className="font-semibold text-obsidian uppercase tracking-wider">{ad}</span>
        <span className="text-charcoal/70 font-normal">{formattedDate}</span>
      </div>
    </Card>
  );
};
