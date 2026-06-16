import React, { Suspense } from "react";
import { PageHero } from "../../../components/common/PageHero";
import { BookingWizard } from "../../../components/booking/BookingWizard";
import { Spinner } from "../../../components/ui/Spinner";

export const metadata = {
  title: "Online Randevu | LuxeBeauty",
  description: "Dilediğiniz hizmeti ve uzmanı seçerek, istediğiniz gün ve saatte online randevunuzu hızlıca oluşturun.",
};

export default function BookingPage() {
  return (
    <div className="bg-ivory min-h-screen pb-24">
      <PageHero
        title="Online Randevu"
        subtitle="Hızlı, zahmetsiz ve tamamen online randevu alma kolaylığı. Adımları takip edin."
        backgroundImage="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
      />

      <div className="max-w-7xl mx-auto mt-8">
        <Suspense fallback={<div className="flex justify-center py-12"><Spinner size="lg" /></div>}>
          <BookingWizard />
        </Suspense>
      </div>
    </div>
  );
}
