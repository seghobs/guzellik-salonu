import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Tag, Calendar, ChevronRight, User } from "lucide-react";
import { getHizmetBySlug, getPersonel } from "@/lib/db";
import { PageHero } from "@/components/common/PageHero";
import { StaffCard } from "@/components/common/StaffCard";
import { Button } from "@/components/ui/Button";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getHizmetBySlug(slug);
  if (!service) return { title: "Hizmet Bulunamadı" };

  return {
    title: `${service.ad} - LuxeBeauty`,
    description: service.aciklama,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getHizmetBySlug(slug);

  if (!service || !service.aktif) {
    notFound();
  }

  // Get staff who can perform this service
  const allStaff = await getPersonel(true);
  const matchedStaff = allStaff.filter((staff) =>
    staff.hizmet_verdigi_hizmetler.includes(service.id)
  );

  return (
    <div className="bg-ivory min-h-screen pb-24">
      <PageHero
        title={service.ad}
        subtitle={service.aciklama}
        backgroundImage={service.gorsel}
      />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-2 text-xs text-charcoal/50">
        <Link href="/" className="hover:text-mauve transition-all">Ana Sayfa</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/hizmetler" className="hover:text-mauve transition-all">Hizmetler</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-charcoal font-medium">{service.ad}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
        {/* Detail Body */}
        <div className="lg:col-span-8 flex flex-col gap-6 bg-white p-8 border border-champagne/40">
          <span className="text-xs uppercase tracking-widest text-mauve font-bold">
            {service.kategori}
          </span>
          <h2 className="font-display text-3xl font-bold text-obsidian tracking-wide uppercase">
            Hizmet Detayları
          </h2>
          <p className="text-sm md:text-base text-charcoal/80 leading-relaxed font-light whitespace-pre-line">
            {service.detayli_aciklama || service.aciklama}
          </p>

          <div className="w-full h-[1px] bg-champagne/20 my-4" />

          {/* Uzmanlar Listesi */}
          <div>
            <h3 className="font-display text-2xl font-bold text-obsidian tracking-wide uppercase mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-mauve" />
              Bu Hizmeti Veren Uzmanlarımız
            </h3>

            {matchedStaff.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchedStaff.map((staff) => (
                  <StaffCard
                    key={staff.id}
                    id={staff.id}
                    ad={staff.ad}
                    unvan={staff.unvan}
                    bio={staff.bio}
                    gorsel={staff.gorsel}
                    puan={staff.puan}
                    yorum_sayisi={staff.yorum_sayisi}
                    uzmanlik_alanlari={staff.uzmanlik_alanlari}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal/50 italic font-light">
                Şu an bu hizmet için aktif personel bulunmamaktadır.
              </p>
            )}
          </div>
        </div>

        {/* Sticky Booking Summary Widget */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
          <div className="bg-obsidian text-champagne border border-mauve/20 p-8 flex flex-col gap-6 shadow-xl">
            <h3 className="font-display text-xl font-bold text-white tracking-widest uppercase border-b border-white/10 pb-4">
              Rezervasyon Özet
            </h3>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-dust" /> Süre:
                </span>
                <span className="font-semibold text-white text-sm">{service.sure_dk} Dakika</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-rose-dust" /> Fiyat:
                </span>
                <span className="font-semibold text-white text-sm">{service.fiyat} TL</span>
              </div>
            </div>

            <Link href={`/randevu?service=${service.id}`} className="w-full">
              <Button variant="secondary" className="w-full group py-4">
                <Calendar className="w-4 h-4 mr-2" />
                Hemen Randevu Al
              </Button>
            </Link>

            <span className="text-[10px] text-champagne/40 text-center font-light leading-relaxed">
              * Randevunuzu onayladıktan sonra size bir onay maili gönderilecektir. İptal ve erteleme işlemlerinizi randevu saatinden 24 saat öncesine kadar gerçekleştirebilirsiniz.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
