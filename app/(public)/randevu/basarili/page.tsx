import React from "react";
import Link from "next/link";
import { CheckCircle2, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Rezervasyon Başarılı | LuxeBeauty",
  description: "Randevunuz başarıyla alınmıştır. Teşekkür ederiz.",
};

export default function BookingSuccessPage() {
  return (
    <div className="bg-ivory min-h-screen flex items-center justify-center py-24 px-6 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-mauve/5 blur-[100px]" />

      <div className="max-w-md w-full bg-white border border-champagne/60 p-10 text-center flex flex-col items-center gap-6 shadow-xl relative z-10 hover-gold-glow animate-fade-in-up">
        {/* Animated Check Ring */}
        <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-600 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-obsidian tracking-wide uppercase">
            Rezervasyon Talebi Alındı!
          </h2>
          <p className="text-xs text-charcoal/70 leading-relaxed font-light mt-1">
            Randevunuz başarıyla oluşturuldu. Talebiniz onaylandıktan sonra belirttiğiniz e-posta adresine detaylı bilgilendirme mesajı gönderilecektir.
          </p>
        </div>

        <div className="w-full h-[1px] bg-champagne/30 my-2" />

        <div className="flex flex-col gap-3 w-full">
          <Link href="/" className="w-full">
            <Button variant="primary" className="w-full justify-center">
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </Link>
          <Link href="/hizmetler" className="w-full">
            <Button variant="outline" className="w-full justify-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Diğer Hizmetleri İncele
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
