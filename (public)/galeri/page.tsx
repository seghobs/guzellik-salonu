import React from "react";
import { getGaleri } from "../../../lib/db";
import { PageHero } from "../../../components/common/PageHero";
import { SectionTitle } from "../../../components/common/SectionTitle";
import GalleryListClient from "./GalleryListClient";

export const metadata = {
  title: "Galeri | LuxeBeauty",
  description: "LuxeBeauty salonunda gerçekleştirdiğimiz tırnak sanatı (nail art), saç renklendirme ve cilt bakımı uygulamalarımız.",
};

export default async function GalleryPage() {
  const galleryItems = await getGaleri();
  const categories = ["Hepsi", ...Array.from(new Set(galleryItems.map((item) => item.kategori)))];

  return (
    <div className="bg-ivory min-h-screen pb-24">
      <PageHero
        title="Görsel Galeri"
        subtitle="Salonumuzda hayat bulan özgün nail art desenleri, saç değişimleri ve cilt bakımı uygulamaları."
        backgroundImage="https://images.unsplash.com/photo-1604654894610-df490c939e05?auto=format&fit=crop&w=1200&q=80"
      />

      <div className="max-w-7xl mx-auto px-6 mt-16">
        <SectionTitle
          accent="Sanat & Stil"
          title="Uygulama Örneklerimiz"
          subtitle="Tüm fotoğraflar salonumuzda uzman ekibimiz tarafından yapılan gerçek misafir uygulamalarımıza aittir."
        />

        <GalleryListClient initialItems={galleryItems} categories={categories} />
      </div>
    </div>
  );
}
