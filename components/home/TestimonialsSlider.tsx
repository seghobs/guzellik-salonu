import React from "react";
import { getYorumlar, getMusteriler } from "../../lib/db";
import { TestimonialCard } from "../common/TestimonialCard";
import { SectionTitle } from "../common/SectionTitle";

export const TestimonialsSlider = async () => {
  // Fetch comments and customers to resolve names
  const comments = await getYorumlar(true);
  const customers = await getMusteriler();

  const resolvedComments = comments.slice(0, 3).map((comment) => {
    const customer = customers.find((c) => c.id === comment.musteri_id);
    return {
      ...comment,
      musteriAd: customer ? customer.ad : "Değerli Müşterimiz",
    };
  });

  if (resolvedComments.length === 0) return null;

  return (
    <section className="py-24 bg-white border-t border-champagne/20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <SectionTitle
          accent="Geri Bildirimler"
          title="Müşteri Yorumları"
          subtitle="Salonumuzdan mutlu ayrılan misafirlerimizin LuxeBeauty deneyimleri hakkındaki gerçek görüşleri."
        />

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {resolvedComments.map((comment) => (
            <div key={comment.id} className="animate-fade-in-up">
              <TestimonialCard
                id={comment.id}
                ad={comment.musteriAd}
                puan={comment.puan}
                yorum={comment.yorum}
                tarih={comment.tarih}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default TestimonialsSlider;
