import React from "react";
import { Hizmet, Personel } from "../../lib/db/jsonDb";
import { PersonalFormData } from "./StepPersonal";
import { Card } from "../ui/Card";
import { Sparkles, Clock, Tag, Calendar, User, Phone, Mail, FileText } from "lucide-react";

interface StepConfirmProps {
  service: Hizmet;
  staff: Personel;
  date: string;
  time: string;
  customer: PersonalFormData;
}

export const StepConfirm: React.FC<StepConfirmProps> = ({
  service,
  staff,
  date,
  time,
  customer,
}) => {
  const formattedDate = new Date(date).toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-left">
      <div className="flex flex-col gap-1 border-b border-champagne/20 pb-4">
        <h3 className="font-display text-xl font-bold text-obsidian tracking-wide uppercase flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-mauve animate-pulse" />
          Adım 5: Rezervasyon Özeti
        </h3>
        <p className="text-xs text-charcoal/60 font-light">
          Lütfen son kez bilgilerinizi kontrol edin ve randevuyu onaylayın.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hizmet & Uzman Bilgileri */}
        <Card padding="md" className="bg-white flex flex-col gap-4">
          <h4 className="font-display text-base font-bold text-obsidian border-b border-champagne/30 pb-2 flex items-center gap-2 uppercase tracking-wider">
            Uygulama Bilgileri
          </h4>

          <div className="flex flex-col gap-3.5 text-xs">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-mauve shrink-0" />
              <div className="flex flex-col">
                <span className="font-semibold text-obsidian">{service.ad}</span>
                <span className="text-[10px] text-charcoal/50">{service.kategori}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-mauve shrink-0" />
              <div className="flex flex-col">
                <span className="font-semibold text-obsidian">{staff.ad}</span>
                <span className="text-[10px] text-mauve/80 italic">{staff.unvan}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-mauve shrink-0" />
              <div className="flex flex-col">
                <span className="font-semibold text-obsidian">{formattedDate}</span>
                <span className="text-[10px] text-charcoal/50">Saat: {time} - {time.split(":")[0]}:59</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-mauve shrink-0" />
              <span>Süre: {service.sure_dk} Dakika</span>
            </div>
          </div>
        </Card>

        {/* Kişisel Bilgiler */}
        <Card padding="md" className="bg-white flex flex-col gap-4">
          <h4 className="font-display text-base font-bold text-obsidian border-b border-champagne/30 pb-2 flex items-center gap-2 uppercase tracking-wider">
            İletişim Bilgileri
          </h4>

          <div className="flex flex-col gap-3.5 text-xs">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-mauve shrink-0" />
              <div className="flex flex-col">
                <span className="font-semibold text-obsidian">{customer.ad}</span>
                {customer.dogum_tarihi && (
                  <span className="text-[10px] text-charcoal/50">
                    Doğum Tarihi: {customer.dogum_tarihi.split("-").reverse().join(".")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-mauve shrink-0" />
              <span>{customer.telefon}</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-mauve shrink-0" />
              <span>{customer.email}</span>
            </div>

            {customer.notlar && (
              <div className="flex items-start gap-3 border-t border-champagne/20 pt-2">
                <FileText className="w-4 h-4 text-mauve shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-obsidian">Notlar:</span>
                  <span className="text-charcoal/70 italic leading-relaxed font-light mt-0.5">{customer.notlar}</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Total Amount card */}
      <div className="bg-obsidian text-champagne p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-mauve/20">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-widest text-rose-dust font-bold">Toplam Ödeme Tutarı</span>
          <span className="text-xs text-champagne/60 font-light">İşlem sonunda salonda ödenecektir.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Tag className="w-5 h-5 text-rose-dust" />
          <span className="text-3xl font-display font-bold text-white tracking-widest">{service.fiyat} TL</span>
        </div>
      </div>
    </div>
  );
};
export default StepConfirm;
