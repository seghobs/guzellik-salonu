import React from "react";
import { getPersonel, getHizmetler } from "../../../../lib/db";
import StaffManageClient from "../../../../components/admin/StaffManageClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Personel Yönetimi | LuxeBeauty Yönetim",
  description: "LuxeBeauty güzellik salonu personel kadrosu ekleme ve yetkilendirme paneli.",
};

export default async function AdminStaffPage() {
  const staff = await getPersonel();
  const services = await getHizmetler();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-champagne/30 pb-4">
        <h2 className="font-display text-3xl font-bold text-obsidian tracking-wide uppercase">
          Personel Yönetimi
        </h2>
        <p className="text-xs text-charcoal/60 font-light">
          Uzman kadronuzun bilgilerini, uzmanlık alanlarını ve verdikleri hizmet yetkilerini yönetin.
        </p>
      </div>

      <StaffManageClient initialStaff={staff} services={services} />
    </div>
  );
}
