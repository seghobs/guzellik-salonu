import React from "react";
import Link from "next/link";
import { Sparkles, Video, Phone, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-obsidian text-champagne/80 pt-16 pb-8 border-t border-mauve/20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* About Salon */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-mauve/20 rounded-full">
              <Sparkles className="w-5 h-5 text-rose-dust" />
            </div>
            <span className="font-display text-2xl font-bold tracking-[0.12em] text-white uppercase">
              Luxe <span className="text-rose-dust font-light tracking-[0.12em]">Beauty</span>
            </span>
          </Link>
          <p className="text-sm text-champagne/60 leading-relaxed font-light mt-2">
            Güzelliğin en rafine hali. Kendinizi özel hissedeceğiniz lüks atmosferimiz ve uzman kadromuzla hizmetinizdeyiz.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://instagram.com/luxebeauty"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 hover:bg-mauve/30 rounded-full hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a
              href="https://facebook.com/luxebeauty"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 hover:bg-mauve/30 rounded-full hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a
              href="https://tiktok.com/@luxebeauty"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 hover:bg-mauve/30 rounded-full hover:text-white transition-all duration-300"
            >
              <Video className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-lg text-white tracking-wider mb-5 font-semibold">Hızlı Menü</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link href="/hizmetler" className="hover:text-rose-dust transition-all">
                Hizmetlerimiz
              </Link>
            </li>
            <li>
              <Link href="/ekip" className="hover:text-rose-dust transition-all">
                Uzman Kadromuz
              </Link>
            </li>
            <li>
              <Link href="/galeri" className="hover:text-rose-dust transition-all">
                Görsel Galeri
              </Link>
            </li>
            <li>
              <Link href="/hakkimizda" className="hover:text-rose-dust transition-all">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-rose-dust transition-all">
                İletişim & Harita
              </Link>
            </li>
          </ul>
        </div>

        {/* Working Hours */}
        <div>
          <h4 className="font-display text-lg text-white tracking-wider mb-5 font-semibold">Çalışma Saatleri</h4>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li className="flex justify-between border-b border-white/5 pb-1.5">
              <span>Pazartesi - Perşembe</span>
              <span className="font-semibold text-white">09:00 - 20:00</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-1.5">
              <span>Cuma - Cumartesi</span>
              <span className="font-semibold text-white">10:00 - 21:00</span>
            </li>
            <li className="flex justify-between text-rose-dust/80">
              <span>Pazar</span>
              <span className="font-semibold uppercase tracking-widest text-rose-dust">Kapalı</span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-display text-lg text-white tracking-wider mb-5 font-semibold">İletişim</h4>
          <ul className="flex flex-col gap-4 text-xs leading-relaxed">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-rose-dust shrink-0 mt-0.5" />
              <span>Nişantaşı Mah. Güzellik Cad. No:42, Şişli / İstanbul</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-rose-dust shrink-0" />
              <span>+90 212 555 00 00</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-rose-dust shrink-0" />
              <span>info@luxebeauty.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-center text-xs text-champagne/40">
        <p>&copy; {new Date().getFullYear()} LuxeBeauty. Tüm hakları saklıdır. Güzelliğin En Rafine Hali.</p>
      </div>
    </footer>
  );
};
