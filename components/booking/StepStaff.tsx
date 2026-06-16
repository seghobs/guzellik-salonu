"use client";

import React, { useState, useEffect } from "react";
import { Personel, Hizmet } from "../../lib/db/jsonDb";
import { Spinner } from "../ui/Spinner";
import { Card } from "../ui/Card";
import { Star } from "lucide-react";

interface StepStaffProps {
  selectedService: Hizmet | null;
  selectedStaff: Personel | null;
  onSelect: (staff: Personel) => void;
}

export const StepStaff: React.FC<StepStaffProps> = ({
  selectedService,
  selectedStaff,
  onSelect,
}) => {
  const [staffList, setStaffList] = useState<Personel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("/api/personel?active=true");
        if (res.ok) {
          const data: Personel[] = await res.json();
          // Filter staff who can perform the selected service
          if (selectedService) {
            const matched = data.filter((p) =>
              p.hizmet_verdigi_hizmetler.includes(selectedService.id)
            );
            setStaffList(matched);
          } else {
            setStaffList(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch staff", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStaff();
  }, [selectedService]);

  if (isLoading) return <div className="py-12 flex justify-center"><Spinner size="md" /></div>;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-xl font-bold text-obsidian tracking-wide uppercase">
          Adım 2: Uzman Seçimi
        </h3>
        <p className="text-xs text-charcoal font-normal">
          Lütfen işleminizi gerçekleştirecek uzman kadro üyemizi seçiniz.
        </p>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1">
        {staffList.map((staff) => {
          const isSelected = selectedStaff?.id === staff.id;
          return (
            <Card
              key={staff.id}
              onClick={() => onSelect(staff)}
              padding="sm"
              hoverGlow={!isSelected}
              className={`cursor-pointer transition-all duration-300 flex items-center gap-4 border ${
                isSelected
                  ? "border-mauve bg-mauve/5 shadow-md"
                  : "border-champagne bg-white hover:border-mauve/40"
              }`}
            >
              <div className="w-16 h-16 shrink-0 overflow-hidden bg-champagne/20 rounded-full">
                <img
                  src={staff.gorsel}
                  alt={staff.ad}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col gap-0.5 text-left">
                <h4 className="font-display font-bold text-base text-obsidian">
                  {staff.ad}
                </h4>
                <span className="font-accent text-xs italic text-mauve font-medium tracking-wide">
                  {staff.unvan}
                </span>
                <p className="text-[11px] text-charcoal/90 line-clamp-1 leading-relaxed font-normal mt-0.5">
                  {staff.bio}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-charcoal/80 font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{staff.puan.toFixed(1)} ({staff.yorum_sayisi} yorum)</span>
                </div>
              </div>
            </Card>
          );
        })}

        {staffList.length === 0 && (
          <div className="col-span-2 text-center py-12 text-charcoal/80 text-sm">
            Bu hizmeti veren müsait bir uzmanımız şu an bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );
};
export default StepStaff;
