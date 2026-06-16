"use client";

import React from "react";
import { Personel } from "../../lib/db/jsonDb";
import { CalendarPicker } from "./CalendarPicker";
import { TimeSlotGrid } from "./TimeSlotGrid";

interface StepDateTimeProps {
  selectedStaff: Personel | null;
  selectedDate: string;
  selectedTime: string;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

export const StepDateTime: React.FC<StepDateTimeProps> = ({
  selectedStaff,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}) => {
  if (!selectedStaff) {
    return (
      <div className="text-center py-12 text-charcoal/80 text-sm italic font-medium">
        Lütfen önce bir uzman seçiniz.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-xl font-bold text-obsidian tracking-wide uppercase">
          Adım 3: Tarih & Saat Seçimi
        </h3>
        <p className="text-xs text-charcoal font-normal">
          Takvimden boş günleri ve sağ taraftan seans saatinizi seçiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Takvim */}
        <div className="md:col-span-6 w-full flex justify-center">
          <CalendarPicker
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              onSelectDate(date);
              onSelectTime(""); // Reset time on date change
            }}
            staff={selectedStaff}
          />
        </div>

        {/* Right: Saat Grid */}
        <div className="md:col-span-6 w-full flex">
          <TimeSlotGrid
            selectedDate={selectedDate}
            selectedStaffId={selectedStaff.id}
            selectedTime={selectedTime}
            onSelectTime={onSelectTime}
          />
        </div>
      </div>
    </div>
  );
};
export default StepDateTime;
