import React from "react";
import { getRandevular, getHizmetler, getPersonel, getMusteriler } from "../../../../lib/db";
import { PageHero } from "../../../../components/common/PageHero";
import AppointmentsListClient from "./AppointmentsListClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Randevular | LuxeBeauty Yönetim",
  description: "LuxeBeauty güzellik salonu randevu listesi ve durum yönetimi.",
};

export default async function AdminAppointmentsPage() {
  const randevular = await getRandevular();
  const services = await getHizmetler();
  const staff = await getPersonel();
  const customers = await getMusteriler();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-champagne/30 pb-4">
        <h2 className="font-display text-3xl font-bold text-obsidian tracking-wide uppercase">
          Randevu Yönetimi
        </h2>
        <p className="text-xs text-charcoal/60 font-light">
          Randevu taleplerini onaylayın, durumlarını güncelleyin veya yeni eklemeler yapın.
        </p>
      </div>

      {/* Client List */}
      <AppointmentsListClient
        initialAppointments={randevular}
        services={services}
        staff={staff}
        customers={customers}
      />
    </div>
  );
}
