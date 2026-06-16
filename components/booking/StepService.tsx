"use client";

import React, { useState, useEffect } from "react";
import { Hizmet } from "../../lib/db/jsonDb";
import { Spinner } from "../ui/Spinner";
import { Card } from "../ui/Card";
import { Clock, Tag } from "lucide-react";

interface StepServiceProps {
  selectedService: Hizmet | null;
  onSelect: (service: Hizmet) => void;
}

export const StepService: React.FC<StepServiceProps> = ({ selectedService, onSelect }) => {
  const [services, setServices] = useState<Hizmet[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("Hepsi");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/hizmetler?active=true");
        if (res.ok) {
          const data = await res.json();
          setServices(data);
          // Set unique categories
          const cats = ["Hepsi", ...Array.from(new Set(data.map((s: Hizmet) => s.kategori)))];
          setCategories(cats as string[]);
        }
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices =
    activeCategory === "Hepsi"
      ? services
      : services.filter((s) => s.kategori === activeCategory);

  if (isLoading) return <div className="py-12 flex justify-center"><Spinner size="md" /></div>;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-xl font-bold text-obsidian tracking-wide uppercase">
          Adım 1: Hizmet Seçimi
        </h3>
        <p className="text-xs text-charcoal font-normal">
          Lütfen almak istediğiniz bakım uygulamasını seçiniz.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5 border-b border-champagne/20 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-[10px] uppercase tracking-widest font-semibold border transition-all rounded-sm cursor-pointer ${
              activeCategory === cat
                ? "bg-mauve border-mauve text-white"
                : "bg-white border-champagne/90 text-charcoal hover:border-mauve hover:text-mauve"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1">
        {filteredServices.map((service) => {
          const isSelected = selectedService?.id === service.id;
          return (
            <Card
              key={service.id}
              onClick={() => onSelect(service)}
              padding="sm"
              hoverGlow={!isSelected}
              className={`cursor-pointer transition-all duration-300 flex items-center gap-4 border ${
                isSelected
                  ? "border-mauve bg-mauve/5 shadow-md"
                  : "border-champagne bg-white hover:border-mauve/40"
              }`}
            >
              <div className="w-16 h-16 shrink-0 overflow-hidden bg-champagne/20 rounded-sm">
                <img
                  src={service.gorsel}
                  alt={service.ad}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1 text-left">
                <h4 className="font-display font-bold text-base text-obsidian">
                  {service.ad}
                </h4>
                <p className="text-[11px] text-charcoal/90 line-clamp-2 leading-relaxed font-normal">
                  {service.aciklama}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-charcoal/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-mauve" /> {service.sure_dk} Dk
                  </span>
                  <span className="flex items-center gap-1 font-bold text-obsidian">
                    <Tag className="w-3.5 h-3.5 text-mauve" /> {service.fiyat} TL
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default StepService;
