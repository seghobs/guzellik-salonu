import React from "react";
import Link from "next/link";
import { Clock, Tag } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

interface ServiceCardProps {
  id: string;
  slug: string;
  ad: string;
  kategori: string;
  sure_dk: number;
  fiyat: number;
  aciklama: string;
  gorsel: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  slug,
  ad,
  kategori,
  sure_dk,
  fiyat,
  aciklama,
  gorsel,
}) => {
  return (
    <Card padding="none" className="group flex flex-col justify-between h-full bg-white">
      {/* Card Image */}
      <div className="relative h-64 overflow-hidden bg-champagne/20">
        <img
          src={gorsel}
          alt={ad}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {/* Category Label */}
        <span className="absolute top-4 left-4 bg-obsidian/85 backdrop-blur-md px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-widest text-champagne shadow-md border border-white/5 rounded-[2px]">
          {kategori}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-5">
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-[18px] md:text-xl font-bold text-obsidian group-hover:text-mauve transition-colors duration-300">
            {ad}
          </h3>
          <p className="text-[13px] text-charcoal/80 line-clamp-3 leading-relaxed font-light">
            {aciklama}
          </p>
        </div>

        {/* Details Row */}
        <div className="flex items-center gap-4 text-xs text-charcoal/70 pt-3.5 border-t border-champagne/20">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-mauve" />
            <span>{sure_dk} Dk</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto font-bold">
            <Tag className="w-4 h-4 text-mauve" />
            <span className="font-display text-obsidian text-[15px] tracking-wide">{fiyat} TL</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2 mt-1">
          <Link href={`/hizmetler/${slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-[10px] tracking-widest uppercase">
              İncele
            </Button>
          </Link>
          <Link href={`/randevu?service=${id}`} className="flex-1">
            <Button variant="primary" size="sm" className="w-full text-[10px] tracking-widest uppercase">
              Randevu
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
