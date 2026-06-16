import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

interface StaffCardProps {
  id: string;
  ad: string;
  unvan: string;
  bio: string;
  gorsel: string;
  puan: number;
  yorum_sayisi: number;
  uzmanlik_alanlari: string[];
}

export const StaffCard: React.FC<StaffCardProps> = ({
  id,
  ad,
  unvan,
  bio,
  gorsel,
  puan,
  yorum_sayisi,
  uzmanlik_alanlari,
}) => {
  return (
    <Card padding="none" className="group bg-white h-full flex flex-col justify-between">
      {/* Image & Badges */}
      <div className="relative h-72 overflow-hidden bg-champagne/20">
        <img
          src={gorsel}
          alt={ad}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {/* Rating Overlay */}
        <div className="absolute bottom-4 right-4 bg-white/85 backdrop-blur-md px-2.5 py-1.5 text-[10px] font-bold text-charcoal shadow-sm flex items-center gap-1.5 rounded-[2px] border border-white/5">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{puan.toFixed(1)}</span>
          <span className="text-[9px] text-charcoal/40 font-normal">({yorum_sayisi})</span>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-5">
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="font-display text-xl font-bold text-obsidian group-hover:text-mauve transition-colors duration-300">
              {ad}
            </h3>
            <span className="font-accent text-sm italic text-mauve font-medium tracking-wide">
              {unvan}
            </span>
          </div>

          <p className="text-[13px] text-charcoal/80 line-clamp-3 leading-relaxed font-light">
            {bio}
          </p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {uzmanlik_alanlari.map((area) => (
              <span
                key={area}
                className="text-[9px] uppercase tracking-wider bg-champagne/45 px-2.5 py-1 text-charcoal font-bold rounded-[2px] border border-champagne/35"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-3.5 border-t border-champagne/20">
          <Link href={`/randevu?staff=${id}`}>
            <Button variant="outline" size="sm" className="w-full text-[10px] tracking-widest uppercase">
              Uzmanla Randevu Al
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
