import React from "react";
import { getPersonel } from "../../../lib/db";
import { PageHero } from "../../../components/common/PageHero";
import { SectionTitle } from "../../../components/common/SectionTitle";
import { StaffCard } from "../../../components/common/StaffCard";

export const metadata = {
  title: "Uzmanlarımız | LuxeBeauty",
  description: "LuxeBeauty güzellik ve saç stilistleri kadrosuyla tanışın.",
};

export default async function TeamPage() {
  const staffList = await getPersonel(true);

  return (
    <div className="bg-ivory min-h-screen pb-24">
      <PageHero
        title="Uzman Kadromuz"
        subtitle="Sizin için en iyisini sunmak adına sürekli kendini geliştiren profesyonel ekibimiz."
        backgroundImage="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
      />

      <div className="max-w-7xl mx-auto px-6 mt-16">
        <SectionTitle
          accent="Profesyoneller"
          title="Güzellik Uzmanlarımız"
          subtitle="Tüm kadromuz hijyen, güncel nail art desenleri ve modern teknikler konusunda özel sertifikalara sahiptir."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staffList.map((staff) => (
            <div key={staff.id} className="animate-fade-in-up">
              <StaffCard
                id={staff.id}
                ad={staff.ad}
                unvan={staff.unvan}
                bio={staff.bio}
                gorsel={staff.gorsel}
                puan={staff.puan}
                yorum_sayisi={staff.yorum_sayisi}
                uzmanlik_alanlari={staff.uzmanlik_alanlari}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
