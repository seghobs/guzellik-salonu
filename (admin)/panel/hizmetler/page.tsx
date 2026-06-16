import React from "react";
import { getHizmetler } from "../../../../lib/db";
import ServicesManageClient from "./ServicesManageClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hizmet Yönetimi | LuxeBeauty Yönetim",
  description: "LuxeBeauty güzellik salonu hizmet menüsü ekleme, çıkarma ve düzenleme paneli.",
};

export default async function AdminServicesPage() {
  const services = await getHizmetler();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-champagne/30 pb-4">
        <h2 className="font-display text-3xl font-bold text-obsidian tracking-wide uppercase">
          Hizmet Yönetimi
        </h2>
        <p className="text-xs text-charcoal/60 font-light">
          Salonunuzda sunduğunuz güzellik seanslarını, sürelerini ve fiyatlarını yapılandırın.
        </p>
      </div>

      <ServicesManageClient initialServices={services} />
    </div>
  );
}
