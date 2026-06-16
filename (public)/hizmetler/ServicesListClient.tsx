"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hizmet } from "../../../lib/db/jsonDb";
import { ServiceCard } from "../../../components/common/ServiceCard";

interface ServicesListClientProps {
  initialServices: Hizmet[];
  categories: string[];
}

export default function ServicesListClient({
  initialServices,
  categories,
}: ServicesListClientProps) {
  const [activeCategory, setActiveCategory] = useState("Hepsi");

  const filteredServices =
    activeCategory === "Hepsi"
      ? initialServices
      : initialServices.filter((s) => s.kategori === activeCategory);

  return (
    <div className="flex flex-col gap-10">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-champagne/30 pb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 text-xs uppercase tracking-widest font-semibold border transition-all duration-300 rounded-sm cursor-pointer ${
              activeCategory === category
                ? "bg-mauve border-mauve text-white shadow-md"
                : "bg-white border-champagne text-charcoal/80 hover:border-mauve hover:text-mauve"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredServices.map((service) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4 }}
              key={service.id}
            >
              <ServiceCard
                id={service.id}
                slug={service.slug}
                ad={service.ad}
                kategori={service.kategori}
                sure_dk={service.sure_dk}
                fiyat={service.fiyat}
                aciklama={service.aciklama}
                gorsel={service.gorsel}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 text-charcoal/50 text-sm">
          Bu kategoride şu an aktif hizmet bulunmamaktadır.
        </div>
      )}
    </div>
  );
}
