import React from "react";
import Link from "next/link";
import { PageHero } from "../../../components/common/PageHero";
import { SectionTitle } from "../../../components/common/SectionTitle";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Sparkles, Heart, ShieldAlert, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Hakkımızda | LuxeBeauty",
  description: "LuxeBeauty güzellik salonu hikayesi, değerleri ve kurumsal misyonu.",
};

export default function AboutPage() {
  const values = [
    {
      icon: <Sparkles className="w-6 h-6 text-mauve" />,
      title: "Estetik ve Yenilik",
      description: "Dünya trendlerini ve sektördeki en son uygulamaları yakından takip ederek, salonumuzda en güncel nail art ve saç tekniklerini uyguluyoruz.",
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-mauve" />,
      title: "Tavizsiz Hijyen",
      description: "Sağlığınızı şansa bırakmıyoruz. Salonumuzda kullanılan tüm aletler medikal düzeyde sterilizasyon süreçlerinden geçirilmektedir.",
    },
    {
      icon: <Heart className="w-6 h-6 text-mauve" />,
      title: "Koşulsuz Memnuniyet",
      description: "Sadece bir güzellik salonu değil, kendinize ayırdığınız özel bir zaman dilimiyiz. Her misafirimizin buradan gülümseyerek ayrılması ana amacımızdır.",
    },
  ];

  return (
    <div className="bg-ivory min-h-screen pb-24">
      <PageHero
        title="Hakkımızda"
        subtitle="Güzelliğin en saf ve rafine halini Nişantaşı&apos;nın kalbinde yeniden tanımlıyoruz."
        backgroundImage="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
      />

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 flex flex-col gap-6 text-left">
          <span className="font-accent text-sm italic text-mauve font-medium tracking-widest">
            Hikayemiz
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-obsidian tracking-wide uppercase">
            Lüks Güzellik Anlayışı
          </h2>
          <div className="w-16 h-[2.5px] bg-gradient-to-r from-mauve to-rose-dust" />
          
          <p className="text-sm md:text-base text-charcoal/80 leading-relaxed font-light tracking-wide">
            LuxeBeauty, 2024 yılında İstanbul Nişantaşı&apos;nda, geleneksel güzellik salonu hizmetlerini premium bir dinlenme deneyimiyle birleştirme vizyonuyla kuruldu. Misafirlerimize yalnızca en iyi uygulamaları sunmayı değil, aynı zamanda günlük hayatın koşturmacasından uzaklaşabilecekleri lüks bir sığınak yaratmayı amaçladık.
          </p>
          <p className="text-sm md:text-base text-charcoal/80 leading-relaxed font-light tracking-wide">
            Uluslararası standartlarda hijyen protokollerimiz, özenle seçilmiş sertifikalı uzmanlarımız ve dünyaca ünlü kozmetik markalarımızla el, saç ve cilt bakımında fark yaratıyoruz. Her bir misafirimize özel ilgi gösteriyor, ihtiyaçlarını analiz ederek kişiselleştirilmiş seanslar kurguluyoruz.
          </p>
        </div>

        <div className="lg:col-span-6 relative h-[450px] border border-champagne/40 p-2 bg-white shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
            alt="Salon İçi Görünüm"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-6 mt-24">
        <SectionTitle
          accent="Değerlerimiz"
          title="Bizi Biz Yapan Prensipler"
          subtitle="Güzellik yolculuğunuzda size eşlik ederken ödün vermediğimiz temel ilkelerimiz."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, index) => (
            <Card key={index} padding="lg" className="bg-white flex flex-col gap-4">
              <div className="p-3 bg-mauve/5 w-fit rounded-full">
                {val.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-obsidian tracking-wide">
                {val.title}
              </h3>
              <p className="text-xs text-charcoal/70 leading-relaxed font-light">
                {val.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Callout */}
      <div className="max-w-5xl mx-auto px-6 mt-24">
        <div className="bg-obsidian text-champagne p-12 text-center flex flex-col items-center gap-6 shadow-2xl relative border border-mauve/20">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
            Sizi Ayrıcalıklı Hissedeceğiniz LuxeBeauty Deneyimine Bekliyoruz
          </h3>
          <p className="text-xs md:text-sm text-champagne/60 font-light max-w-xl leading-relaxed">
            Hemen şimdi online randevu takvimimizden kendinize en uygun saati seçin, lüks bakımınız için yerinizi şimdiden ayırtın.
          </p>
          <Link href="/randevu">
            <Button variant="secondary" size="lg">
              Hemen Yerini Ayırt
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
