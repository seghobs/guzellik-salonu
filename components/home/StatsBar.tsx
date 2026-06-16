"use client";

import React from "react";
import { motion } from "framer-motion";

export const StatsBar: React.FC = () => {
  const stats = [
    { value: "10+", label: "Yıllık Tecrübe" },
    { value: "4K+", label: "Mutlu Misafir" },
    { value: "15+", label: "Uzman Personel" },
    { value: "50+", label: "Hizmet Çeşidi" },
  ];

  return (
    <section className="bg-gradient-to-r from-obsidian via-[#231720] to-obsidian text-champagne py-16 border-t border-b border-mauve/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col gap-2 select-none"
            >
              <span className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-b from-white via-champagne to-rose-dust bg-clip-text text-transparent tracking-widest">
                {stat.value}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-rose-dust/80 font-bold">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default StatsBar;
