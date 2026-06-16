import React from "react";
import Link from "next/link";
import { Sparkles, Calendar } from "lucide-react";
import { Button } from "../ui/Button";

export const CTASection: React.FC = () => {
  return (
    <section className="relative py-24 bg-obsidian overflow-hidden border-t border-mauve/20">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-mauve/10 blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
        <div className="p-2 bg-mauve/20 rounded-full inline-flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-rose-dust animate-pulse" />
        </div>

        <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-wider uppercase leading-tight">
          Kendinize Bir Güzellik Yapın, <br />
          <span className="font-accent text-rose-dust italic lowercase font-light">lüksü</span> Hissedin
        </h2>

        <p className="text-sm md:text-base text-champagne max-w-xl mx-auto font-normal leading-relaxed tracking-wide">
          Hemen online randevunuzu oluşturun, dilediğiniz günü ve saati seçin, uzman kadromuzla buluşun. Telefonla aramanıza gerek kalmadan tüm randevu detaylarınızı yönetin.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-4 w-full sm:w-auto">
          <Link href="/randevu" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              <Calendar className="w-4 h-4 mr-2" />
              Online Randevu Al
            </Button>
          </Link>
          <Link href="/iletisim" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-champagne text-champagne hover:bg-champagne hover:text-obsidian">
              Bize Ulaşın
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default CTASection;
