import React from "react";
import Link from "next/link";
import { getHizmetler } from "../../lib/db";
import { ServiceCard } from "../common/ServiceCard";
import { SectionTitle } from "../common/SectionTitle";
import { Button } from "../ui/Button";

export const ServicesPreview = async () => {
  // Fetch active services from JSON DB
  const services = await getHizmetler(true);
  const featuredServices = services.filter((s) => s.one_cikan).slice(0, 3);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-ivory border-t border-champagne/20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <SectionTitle
          accent="Öne Çıkanlar"
          title="Lüks Hizmetlerimiz"
          subtitle="En popüler uygulamalarımızı inceleyin ve kendinize en uygun bakımı seçerek hemen randevunuzu planlayın."
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
          {featuredServices.map((service) => (
            <div key={service.id} className="animate-fade-in-up">
              <ServiceCard
                id={service.id}
                slug={service.slug}
                ad={service.ad}
                kategori={service.kategori}
                sure_dk={service.sure_dk}
                fiyat={service.fiyat}
                aciklama={service.aciklama}
                gorsel={service.gorsel}
              />
            </div>
          ))}
        </div>

        {/* All Services CTA */}
        <Link href="/hizmetler">
          <Button variant="outline" size="lg">
            Tüm Hizmetlerimizi Gör
          </Button>
        </Link>
      </div>
    </section>
  );
};
export default ServicesPreview;
