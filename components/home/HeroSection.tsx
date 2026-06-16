"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-ivory">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-mauve/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] rounded-full bg-rose-dust/5 blur-3xl" />
      
      {/* Overlay Texture (Subtle grid/gradient) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80')` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Text Area */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 bg-mauve/10 text-mauve px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
          >
            <Sparkles className="w-4 h-4" />
            <span>LuxeBeauty Nişantaşı</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-obsidian tracking-wider leading-[1.1]"
          >
            Güzelliğin En <br />
            <span className="bg-gradient-to-r from-mauve via-rose-dust to-mauve bg-clip-text text-transparent font-accent italic lowercase font-light">rafine</span> Hali
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-charcoal text-sm md:text-base lg:text-lg max-w-xl font-normal leading-relaxed tracking-wide"
          >
            Sıradanlıktan uzaklaşın. Kişiselleştirilmiş hizmetlerimiz, yüksek standartlardaki hijyen anlayışımız ve uluslararası deneyime sahip uzman kadromuzla LuxeBeauty&apos;de şımartılmaya davetlisiniz.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mt-2 w-full sm:w-auto"
          >
            <Link href="/randevu" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-md">
                Randevu Oluştur
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/hizmetler" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Hizmetleri İncele
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Visual Showcase (Offset Grid of Images with Frame Effect) */}
        <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center select-none">
          {/* Subtle glowing background sphere */}
          <div className="absolute w-[350px] h-[350px] rounded-full bg-mauve/10 blur-3xl -z-10" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: -2, y: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: -2,
              y: [0, -12, 0]
            }}
            transition={{ 
              opacity: { duration: 0.8, delay: 0.2 },
              scale: { duration: 0.8, delay: 0.2 },
              rotate: { duration: 0.8, delay: 0.2 },
              y: {
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut"
              }
            }}
            className="w-[280px] h-[380px] bg-white/80 backdrop-blur-sm p-2 shadow-[0_20px_50px_rgba(139,94,131,0.12)] relative z-10 border border-champagne/60 outline outline-1 outline-mauve/15 outline-offset-4"
          >
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=500&q=80"
              alt="Salon Arayüzü"
              className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: 6, y: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 6,
              y: [0, 10, 0]
            }}
            transition={{ 
              opacity: { duration: 0.8, delay: 0.4 },
              scale: { duration: 0.8, delay: 0.4 },
              rotate: { duration: 0.8, delay: 0.4 },
              y: {
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
                delay: 0.5
              }
            }}
            className="w-[220px] h-[280px] bg-white/90 backdrop-blur-sm p-2 shadow-[0_20px_40px_rgba(139,94,131,0.15)] absolute -bottom-10 -left-6 z-20 border border-champagne/60 outline outline-1 outline-mauve/15 outline-offset-4"
          >
            <img
              src="https://images.unsplash.com/photo-1604654894610-df490c939e05?auto=format&fit=crop&w=400&q=80"
              alt="Nail Art"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
