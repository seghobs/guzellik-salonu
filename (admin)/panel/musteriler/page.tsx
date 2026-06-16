import React from "react";
import { getMusteriler } from "../../../../lib/db";
import CustomersManageClient from "../../../../components/admin/CustomersManageClient";
import { UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Müşteriler | LuxeBeauty Yönetim",
  description: "LuxeBeauty müşteri veritabanı, ziyaret sayıları ve toplam harcama analizleri.",
};

export default async function AdminCustomersPage() {
  const musteriler = await getMusteriler();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-champagne/30 pb-4">
        <h2 className="font-display text-3xl font-bold text-obsidian tracking-wide uppercase flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-mauve" />
          Müşteri Veritabanı
        </h2>
        <p className="text-xs text-charcoal/60 font-light">
          Kayıtlı misafirlerinizin ziyaret sıklığı ve harcama detayları.
        </p>
      </div>

      <CustomersManageClient initialCustomers={musteriler} />
    </div>
  );
}
