import React from "react";
import { getGaleri } from "../../../../lib/db";
import GalleryManageClient from "./GalleryManageClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Galeri Yönetimi | LuxeBeauty Yönetim",
  description: "LuxeBeauty görsel galeri kataloğu ekleme ve silme paneli.",
};

export default async function AdminGalleryPage() {
  const galleryItems = await getGaleri();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-champagne/30 pb-4">
        <h2 className="font-display text-3xl font-bold text-obsidian tracking-wide uppercase">
          Galeri Yönetimi
        </h2>
        <p className="text-xs text-charcoal/60 font-light">
          Web sitesinde sergilenen uygulama örneklerini yönetin (Nail Art, Saç, vb.).
        </p>
      </div>

      <GalleryManageClient initialItems={galleryItems} />
    </div>
  );
}
