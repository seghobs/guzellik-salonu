import React from "react";
import Link from "next/link";
import { getPersonel } from "../../lib/db";
import { StaffCard } from "../common/StaffCard";
import { SectionTitle } from "../common/SectionTitle";
import { Button } from "../ui/Button";

export const TeamPreview = async () => {
  // Fetch active staff from JSON DB
  const staffList = await getPersonel(true);
  const featuredStaff = staffList.slice(0, 3);

  return (
    <section className="py-24 bg-white border-t border-champagne/20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <SectionTitle
          accent="Uzman Kadro"
          title="Profesyonel Ekibimiz"
          subtitle="Alanlarında uluslararası eğitimler almış, tecrübeli ve güler yüzlü uzmanlarımızla tanışın."
        />

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
          {featuredStaff.map((staff) => (
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

        {/* All Team CTA */}
        <Link href="/ekip">
          <Button variant="outline" size="lg">
            Tüm Uzmanlarımızı Tanı
          </Button>
        </Link>
      </div>
    </section>
  );
};
export default TeamPreview;
