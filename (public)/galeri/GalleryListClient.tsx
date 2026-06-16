"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GaleriItem } from "../../../lib/db/jsonDb";

interface GalleryListClientProps {
  initialItems: GaleriItem[];
  categories: string[];
}

export default function GalleryListClient({
  initialItems,
  categories,
}: GalleryListClientProps) {
  const [activeCategory, setActiveCategory] = useState("Hepsi");

  const filteredItems =
    activeCategory === "Hepsi"
      ? initialItems
      : initialItems.filter((i) => i.kategori === activeCategory);

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

      {/* Grid Layout */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4 }}
              key={item.id}
              className="relative group overflow-hidden h-96 border border-champagne/30 shadow-sm"
            >
              <img
                src={item.gorsel}
                alt={item.baslik}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/45 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-6">
                <span className="text-[10px] text-rose-dust font-bold uppercase tracking-widest mb-1.5">
                  {item.kategori}
                </span>
                <h4 className="font-display text-lg text-white font-bold tracking-wide uppercase">
                  {item.baslik}
                </h4>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-charcoal/50 text-sm">
          Bu kategoride görsel bulunmamaktadır.
        </div>
      )}
    </div>
  );
}
