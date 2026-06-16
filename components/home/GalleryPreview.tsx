import React from "react";
import Link from "next/link";
import { getGaleri } from "../../lib/db";
import { SectionTitle } from "../common/SectionTitle";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export const GalleryPreview = async () => {
  const galleryItems = await getGaleri(true);
  const previewItems = galleryItems.slice(0, 3);

  return (
    <section className="py-24 bg-ivory border-t border-champagne/20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <SectionTitle
          accent="Sanatımız"
          title="Çalışmalarımızdan Kareler"
          subtitle="Salonumuzda yaptığımız nail art, saç kesimi ve cilt bakımı uygulamalarının gerçek sonuçlarına göz atın."
        />

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          {previewItems.map((item) => (
            <div
              key={item.id}
              className="relative group overflow-hidden h-96 border border-champagne/30 shadow-md animate-fade-in-up"
            >
              <img
                src={item.gorsel}
                alt={item.baslik}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-6">
                <span className="text-[10px] text-rose-dust font-bold uppercase tracking-widest mb-1.5">
                  {item.kategori}
                </span>
                <h4 className="font-display text-lg text-white font-bold tracking-wide uppercase">
                  {item.baslik}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* All Gallery CTA */}
        <Link href="/galeri">
          <Button variant="outline" size="lg">
            Tüm Galeriyi İncele
          </Button>
        </Link>
      </div>
    </section>
  );
};
export default GalleryPreview;
