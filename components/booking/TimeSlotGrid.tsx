"use client";

import React, { useState, useEffect } from "react";
import { Spinner } from "../ui/Spinner";
import { Clock } from "lucide-react";

interface TimeSlotGridProps {
  selectedDate: string;
  selectedStaffId: string;
  selectedTime: string;
  onSelectTime: (time: string) => void;
}

interface ApiSlot {
  saat: string;
  musait: boolean;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  selectedDate,
  selectedStaffId,
  selectedTime,
  onSelectTime,
}) => {
  const [slots, setSlots] = useState<ApiSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedDate || !selectedStaffId) return;

    const fetchSlots = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/musait-saatler?tarih=${selectedDate}&personel_id=${selectedStaffId}`
        );
        if (res.ok) {
          const data = await res.json();
          setSlots(data);
        } else {
          setError("Saat dilimleri yüklenemedi");
        }
      } catch (err) {
        setError("Müsait saatler yüklenirken hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedStaffId]);

  if (!selectedDate) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-charcoal/80 text-xs border border-dashed border-champagne rounded-sm min-h-[200px]">
        <Clock className="w-6 h-6 mb-2 text-charcoal/50 animate-pulse" />
        <span>Lütfen önce sol takvimden bir tarih seçiniz.</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spinner size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-rose-500 text-xs py-12">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h4 className="text-xs uppercase tracking-widest text-charcoal font-semibold font-body border-b border-champagne/30 pb-2">
        Seçilen Tarih: {selectedDate.split("-").reverse().join(".")}
      </h4>

      {slots.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[300px] pr-1">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot.saat;
            const isDisabled = !slot.musait;

            return (
              <button
                key={slot.saat}
                type="button"
                disabled={isDisabled}
                onClick={() => onSelectTime(slot.saat)}
                className={`py-3.5 px-2 text-xs font-bold rounded-sm tracking-widest border transition-all cursor-pointer select-none ${
                  isSelected
                    ? "bg-gradient-to-r from-mauve to-[#764E70] border-transparent text-white shadow-md scale-102"
                    : isDisabled
                    ? "text-charcoal/20 bg-charcoal/5 border-transparent cursor-not-allowed font-normal"
                    : "bg-white border-champagne/75 text-charcoal hover:border-mauve hover:text-mauve hover:bg-champagne/10"
                }`}
              >
                {slot.saat}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-charcoal/80 text-xs italic font-medium">
          Bu tarihte seçilen uzmana ait uygun saat bulunmamaktadır.
        </div>
      )}
    </div>
  );
};
export default TimeSlotGrid;
