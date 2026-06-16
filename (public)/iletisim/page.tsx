import React from "react";
import { PageHero } from "../../../components/common/PageHero";
import { SectionTitle } from "../../../components/common/SectionTitle";
import { ContactForm } from "../../../components/common/ContactForm";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Card } from "../../../components/ui/Card";

export const metadata = {
  title: "İletişim | LuxeBeauty",
  description: "LuxeBeauty Nişantaşı şubesi iletişim bilgileri, telefon, harita ve mesaj formu.",
};

export default function ContactPage() {
  return (
    <div className="bg-ivory min-h-screen pb-24">
      <PageHero
        title="İletişim"
        subtitle="Bizimle iletişime geçin, sorularınızı sorun veya salonumuzu ziyaret edin."
        backgroundImage="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
      />

      <div className="max-w-7xl mx-auto px-6 mt-16">
        <SectionTitle
          accent="Ulaşım"
          title="Bizimle İletişime Geçin"
          subtitle="Sorularınız, geri bildirimleriniz veya özel organizasyon talepleriniz için formu doldurabilir veya doğrudan arayabilirsiniz."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
          {/* Contact Information Details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card padding="lg" className="bg-white flex flex-col gap-6 h-full justify-between">
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-2xl font-bold text-obsidian tracking-wide uppercase border-b border-champagne/30 pb-3">
                  Salon Bilgileri
                </h3>

                <ul className="flex flex-col gap-5 text-sm">
                  <li className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-mauve shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-obsidian">Adres</span>
                      <span className="text-charcoal/70 font-light">Nişantaşı Mah. Güzellik Cad. No:42, Şişli / İstanbul</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-mauve shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-obsidian">Telefon</span>
                      <span className="text-charcoal/70 font-light">+90 212 555 00 00</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-mauve shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-obsidian">E-posta</span>
                      <span className="text-charcoal/70 font-light">info@luxebeauty.com</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Working Hours mini widget */}
              <div className="pt-6 border-t border-champagne/30 flex flex-col gap-3">
                <span className="font-semibold text-obsidian text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-mauve" /> Çalışma Saatleri
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-charcoal/70 font-light">
                  <span>Pazartesi - Perşembe:</span>
                  <span className="font-semibold text-obsidian text-right">09:00 - 20:00</span>
                  <span>Cuma - Cumartesi:</span>
                  <span className="font-semibold text-obsidian text-right">10:00 - 21:00</span>
                  <span className="text-rose-600">Pazar:</span>
                  <span className="font-bold uppercase text-rose-600 text-right">Kapalı</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>

        {/* Map Integration Placeholder */}
        <div className="w-full h-[400px] border border-champagne/40 bg-white p-2 mt-12 shadow-sm">
          <iframe
            title="LuxeBeauty Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.8258019349887!2d28.988081676497163!3d41.050893071343794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7a34614e5cf%3A0x86134b22c7170a4a!2zTmnFn2FudGHFn8EsIMWeacWfbGkvxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1717316719119!5m2!1str!2str"
            className="w-full h-full object-cover grayscale-[30%] opacity-90"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
