"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Hizmet, Personel } from "../../lib/db/jsonDb";
import { Button } from "../ui/Button";
import { useToast } from "../ui/Toast";
import StepService from "./StepService";
import StepStaff from "./StepStaff";
import StepDateTime from "./StepDateTime";
import StepPersonal, { PersonalFormData } from "./StepPersonal";
import StepConfirm from "./StepConfirm";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

export const BookingWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [service, setService] = useState<Hizmet | null>(null);
  const [staff, setStaff] = useState<Personel | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customer, setCustomer] = useState<PersonalFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const serviceId = searchParams.get("service");
  const staffId = searchParams.get("staff");

  useEffect(() => {
    console.log("BookingWizard Mount/Update: Query params found:", { serviceId, staffId });
    if (!serviceId && !staffId) return;

    const loadPreselectedData = async () => {
      let resolvedService: Hizmet | null = null;
      let resolvedStaff: Personel | null = null;

      if (serviceId) {
        try {
          console.log(`BookingWizard: Fetching service details for ID/Slug: ${serviceId}...`);
          const res = await fetch(`/api/hizmetler/${serviceId}`);
          console.log(`BookingWizard: Fetch status: ${res.status}`);
          if (res.ok) {
            resolvedService = await res.json();
            console.log("BookingWizard: Resolved Service:", resolvedService);
            setService(resolvedService);
          }
        } catch (err) {
          console.error("Failed to fetch pre-selected service", err);
        }
      }

      if (staffId) {
        try {
          console.log(`BookingWizard: Fetching staff details for ID: ${staffId}...`);
          const res = await fetch(`/api/personel?id=${staffId}`);
          console.log(`BookingWizard: Fetch status: ${res.status}`);
          if (res.ok) {
            resolvedStaff = await res.json();
            console.log("BookingWizard: Resolved Staff:", resolvedStaff);
            setStaff(resolvedStaff);
          }
        } catch (err) {
          console.error("Failed to fetch pre-selected staff", err);
        }
      }

      // Automatically advance step based on what was preselected
      console.log("BookingWizard: Advancing step logic:", { resolvedService, resolvedStaff });
      if (resolvedService && resolvedStaff) {
        console.log("BookingWizard: Setting step to 3");
        setStep(3);
      } else if (resolvedService) {
        console.log("BookingWizard: Setting step to 2");
        setStep(2);
      } else if (resolvedStaff) {
        console.log("BookingWizard: Setting step to 1");
        setStep(1);
      }
    };

    loadPreselectedData();
  }, [serviceId, staffId]);

  const handleNext = () => {
    setDirection(1);
    if (step < 5) {
      if (step === 4) {
        // Trigger StepPersonal form submit programmatically
        const form = document.getElementById("booking-personal-form") as HTMLFormElement;
        if (form) form.requestSubmit();
      } else {
        setStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setDirection(-1);
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // Callback from StepPersonal when validation is successful
  const handleSavePersonal = (data: PersonalFormData) => {
    setDirection(1);
    setCustomer(data);
    setStep(5);
  };

  // Final submission on Step 5
  const handleConfirmBooking = async () => {
    if (!service || !staff || !date || !time || !customer) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/randevular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hizmet_id: service.id,
          personel_id: staff.id,
          tarih: date,
          baslangic_saati: time,
          notlar: customer.notlar || "",
          musteri: {
            ad: customer.ad,
            telefon: customer.telefon,
            email: customer.email,
            dogum_tarihi: customer.dogum_tarihi,
          },
        }),
      });

      if (res.ok) {
        showToast("Randevunuz başarıyla oluşturuldu! Onay maili gönderildi.", "success");
        router.push("/randevu/basarili");
      } else {
        const data = await res.json();
        showToast(data.message || "Randevu kaydı başarısız oldu.", "error");
      }
    } catch (err) {
      showToast("Sunucuyla bağlantı kurulamadı.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isNextDisabled = () => {
    if (step === 1 && !service) return true;
    if (step === 2 && !staff) return true;
    if (step === 3 && (!date || !time)) return true;
    return false;
  };

  const stepLabels = ["Hizmet", "Uzman", "Tarih & Saat", "Kişisel Bilgiler", "Özet & Onay"];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10">
      {/* Visual Step Progress Indicator */}
      <div className="w-full flex justify-between items-center relative select-none">
        {/* Background connector line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-champagne/50 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-mauve to-[#764E70] -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${((step - 1) / 4) * 100}%` }}
        />

        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = step === stepNumber;
          const isCompleted = step > stepNumber;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 border ${
                  isActive
                    ? "bg-gradient-to-r from-mauve to-[#764E70] text-white ring-4 ring-mauve/15 scale-110 border-transparent shadow-md"
                    : isCompleted
                    ? "bg-mauve text-white border-transparent"
                    : "bg-white border-champagne text-charcoal/50 hover:border-mauve/30 shadow-sm"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
              </div>
              <span
                className={`text-[9px] uppercase tracking-widest font-bold hidden sm:block ${
                  isActive ? "text-mauve" : "text-charcoal/70"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main wizard step content box */}
      <div className="bg-white border border-champagne/40 p-8 shadow-sm rounded-sm min-h-[400px] flex flex-col justify-between hover-gold-glow relative overflow-hidden">
        <div className="flex-1 mb-8 overflow-hidden relative">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? 30 : -30,
                  opacity: 0
                }),
                center: {
                  x: 0,
                  opacity: 1
                },
                exit: (dir: number) => ({
                  x: dir > 0 ? -30 : 30,
                  opacity: 0
                })
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.15 }
              }}
            >
              {step === 1 && (
                <StepService
                  selectedService={service}
                  onSelect={(s) => {
                    setService(s);
                    setStaff(null); // Reset staff if service changes
                    setDate("");
                    setTime("");
                  }}
                />
              )}
              {step === 2 && (
                <StepStaff
                  selectedService={service}
                  selectedStaff={staff}
                  onSelect={(st) => {
                    setStaff(st);
                    setDate("");
                    setTime("");
                  }}
                />
              )}
              {step === 3 && (
                <StepDateTime
                  selectedStaff={staff}
                  selectedDate={date}
                  selectedTime={time}
                  onSelectDate={setDate}
                  onSelectTime={setTime}
                />
              )}
              {step === 4 && (
                <StepPersonal
                  formId="booking-personal-form"
                  initialData={customer}
                  onSave={handleSavePersonal}
                />
              )}
              {step === 5 && service && staff && customer && (
                <StepConfirm
                  service={service}
                  staff={staff}
                  date={date}
                  time={time}
                  customer={customer}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Wizard Control Buttons */}
        <div className="flex items-center justify-between border-t border-champagne/20 pt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className={`flex items-center pl-4 pr-6 ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Geri
          </Button>

          {step < 5 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="flex items-center pl-6 pr-4"
            >
              İleri <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleConfirmBooking}
              isLoading={isSubmitting}
              className="px-10 py-4"
            >
              Randevuyu Onayla ve Bitir
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default BookingWizard;
