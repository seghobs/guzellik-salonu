import React from "react";
import { getHizmetler } from "../../../lib/db";
import { PageHero } from "../../../components/common/PageHero";
import { SectionTitle } from "../../../components/common/SectionTitle";
import { ServiceCard } from "../../../components/common/ServiceCard";
import ServicesListClient from "./ServicesListClient";

export const metadata = {
  title: "Hizmetlerimiz | LuxeBeauty",
  description: "El & Tırnak, Cilt Bakımı ve Saç tasarımı alanında sunduğumuz lüks ve profesyonel hizmetler.",
};

export default async function ServicesPage() {
  const services = await getHizmetler(true);

  // Extract unique categories for filtering
  const categories = ["Hepsi", ...Array.from(new Set(services.map((s) => s.kategori)))];

  return (
    <div className="bg-ivory min-h-screen pb-24">
      <PageHero
        title="Hizmetlerimiz"
        subtitle="Size özel hazırlanan saç, tırnak ve cilt bakımı seanslarımızla kendinizi şımartın."
        backgroundImage="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
      />

      <div className="max-w-7xl mx-auto px-6 mt-16">
        <SectionTitle
          accent="Uygulamalar"
          title="Bakım & Güzellik Menümüz"
          subtitle="Tüm hizmetlerimiz yüksek hijyen standartlarında ve alanında uzman profesyonellerimiz tarafından gerçekleştirilmektedir."
        />

        {/* Client-side filterable list */}
        <ServicesListClient initialServices={services} categories={categories} />
      </div>
    </div>
  );
}
