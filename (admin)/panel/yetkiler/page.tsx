import React from "react";
import { getMusteriler } from "../../../../lib/db";
import RolesManageClient from "../../../../components/admin/RolesManageClient";
import { UserCog } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Üye Yetkileri | LuxeBeauty Yönetim",
  description: "LuxeBeauty üye yetki yönetimi ve yöneticiler.",
};

export default async function AdminRolesPage() {
  const allCustomers = await getMusteriler();
  // Filter registered members only
  const registeredMembers = allCustomers.filter((c) => c.kayitli_uye);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-champagne/30 pb-4">
        <h2 className="font-display text-3xl font-bold text-obsidian tracking-wide uppercase flex items-center gap-2">
          <UserCog className="w-6 h-6 text-mauve" />
          Üye Yetki Yönetimi
        </h2>
        <p className="text-xs text-charcoal/60 font-light">
          Kayıtlı üyelerin sistem yetkilerini düzenleyin, yöneticiler (admin) atayın veya üyelikleri silin.
        </p>
      </div>

      <RolesManageClient initialMembers={registeredMembers} />
    </div>
  );
}
