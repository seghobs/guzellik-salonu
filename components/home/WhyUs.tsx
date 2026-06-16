import React from "react";
import { Shield, Sparkles, Award, Coffee } from "lucide-react";
import { SectionTitle } from "../common/SectionTitle";
import { Card } from "../ui/Card";

export const WhyUs: React.FC = () => {
  const reasons = [
    {
      icon: <Shield className="w-8 h-8 text-mauve" />,
      title: "Medikal Düzeyde Hijyen",
      description: "Sağlığınız bizim için birinci öncelik. Tüm aletlerimiz her kullanımdan sonra otoklav cihazlarında sterilize edilmekte ve tek kullanımlık setler tercih edilmektedir.",
    },
    {
      icon: <Award className="w-8 h-8 text-mauve" />,
      title: "Uzman Kadro & Eğitim",
      description: "Stilistlerimiz ve uzmanlarımız, dünya standartlarındaki gelişmeleri takip eden, sürekli eğitim alan ve en az 5 yıl sektör deneyimi olan profesyonellerdir.",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-mauve" />,
      title: "Premium Ürün Kalitesi",
      description: "Uygulamalarımızda sadece dünyaca kendini kanıtlamış, tırnağa ve cilde zarar vermeyen, dermatolojik olarak onaylanmış lüks kozmetik markaları kullanılır.",
    },
    {
      icon: <Coffee className="w-8 h-8 text-mauve" />,
      title: "Konforlu & Lüks Deneyim",
      description: "Gürültüden uzak, rahatlatıcı müzikler ve aromaterapi kokuları eşliğinde, özel içecek ikramlarımızla kendinizi evinizde hissedeceğiniz bir dinlenme alanı sunuyoruz.",
    },
  ];

  return (
    <section className="py-24 bg-ivory border-t border-champagne/20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle
          accent="Ayrıcalıklar"
          title="Neden LuxeBeauty?"
          subtitle="Sıradan bir salon deneyiminden çok daha fazlasını sunuyoruz. Sizin için özenle hazırladığımız detaylar."
        />

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <Card
              key={index}
              padding="lg"
              className="bg-white flex flex-col gap-5 text-center items-center group cursor-default"
            >
              <div className="p-4 bg-mauve/5 rounded-full mb-1 group-hover:bg-mauve/10 group-hover:scale-110 transition-all duration-300">
                {reason.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-obsidian tracking-wide">
                {reason.title}
              </h3>
              <p className="text-xs text-charcoal/70 leading-relaxed font-light">
                {reason.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default WhyUs;
