"use client";

import React, { useState } from "react";
import { Personel } from "../../lib/db/jsonDb";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarPickerProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  staff: Personel;
}

const DAYS_TR_MAP: { [key: number]: string } = {
  0: "pazar",
  1: "pazartesi",
  2: "sali",
  3: "carsamba",
  4: "persembe",
  5: "cuma",
  6: "cumartesi",
};

const MONTHS_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const WEEKDAYS_SHORT = ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"];

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  onSelectDate,
  staff,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    // Prevent going to past months relative to today
    const today = new Date();
    if (year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth())) {
      setCurrentDate(new Date(year, month - 1, 1));
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const renderDays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayCells = [];

    // Fill blank cells for days before the 1st
    // Adjust firstDayIndex to make Monday first, or keep standard (0 is Sunday)
    // Let's stick to standard 0-6 (Sun-Sat) for simplicity
    for (let i = 0; i < firstDayIndex; i++) {
      dayCells.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Fill days of the month
    for (let day = 1; day <= totalDays; day++) {
      const cellDate = new Date(year, month, day);
      cellDate.setHours(0, 0, 0, 0);

      const dayOfWeekNum = cellDate.getDay();
      const dayNameTr = DAYS_TR_MAP[dayOfWeekNum];

      const isPast = cellDate.getTime() < today.getTime();
      const worksToday = staff.musait_gunler.includes(dayNameTr);
      const isDisabled = isPast || !worksToday;

      const formattedCellDate = `${year}-${(month + 1)
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      
      const isSelected = selectedDate === formattedCellDate;

      dayCells.push(
        <button
          key={`day-${day}`}
          type="button"
          disabled={isDisabled}
          onClick={() => onSelectDate(formattedCellDate)}
          className={`h-10 w-full text-xs font-bold rounded-sm transition-all flex items-center justify-center cursor-pointer border ${
            isSelected
              ? "bg-gradient-to-r from-mauve to-[#764E70] text-white shadow-md scale-105 border-transparent"
              : isDisabled
              ? "text-charcoal/20 bg-transparent border-transparent cursor-not-allowed font-normal"
              : "bg-white border-champagne/75 text-charcoal hover:border-mauve hover:text-mauve hover:bg-champagne/10"
          }`}
        >
          {day}
        </button>
      );
    }

    return dayCells;
  };

  return (
    <div className="bg-white border border-champagne/40 p-5 rounded-sm max-w-sm w-full mx-auto select-none shadow-[0_4px_25px_rgba(26,17,24,0.02)]">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-champagne/30">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 text-charcoal hover:text-mauve hover:bg-champagne/30 transition-all rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-display font-bold text-sm text-obsidian uppercase tracking-wider">
          {MONTHS_TR[month]} {year}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 text-charcoal hover:text-mauve hover:bg-champagne/30 transition-all rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-charcoal/90 uppercase tracking-widest mb-2">
        {WEEKDAYS_SHORT.map((wd) => (
          <div key={wd}>{wd}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};
export default CalendarPicker;
