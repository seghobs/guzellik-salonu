import React from "react";
import Link from "next/link";
import { getRandevular, getHizmetler, getPersonel, getMusteriler, getYorumlar } from "../../../lib/db";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import {
  DollarSign,
  CalendarDays,
  Sparkles,
  Users,
  Clock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | LuxeBeauty Yönetim",
  description: "LuxeBeauty salon yönetim panel istatistikleri ve analizleri.",
};

export default async function DashboardPage() {
  const randevular = await getRandevular();
  const hizmetler = await getHizmetler();
  const personel = await getPersonel();
  const musteriler = await getMusteriler();

  // Calculations
  const approvedBookings = randevular.filter((r) => r.durum === "onaylandi" || r.durum === "tamamlandi");
  const totalIncome = approvedBookings.reduce((sum, item) => sum + item.toplam_fiyat, 0);

  const pendingBookings = randevular.filter((r) => r.durum === "beklemede");
  
  const recentBookings = randevular.slice(0, 5);

  const stats = [
    {
      label: "Toplam Gelir",
      value: `${totalIncome} TL`,
      desc: "Onaylı/Tamamlanan işlemler",
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-500/10",
    },
    {
      label: "Randevular",
      value: randevular.length,
      desc: `${pendingBookings.length} bekleyen işlem`,
      icon: <CalendarDays className="w-5 h-5 text-mauve" />,
      bg: "bg-mauve/10",
    },
    {
      label: "Müşteriler",
      value: musteriler.length,
      desc: "Kayıtlı misafir sayısı",
      icon: <Users className="w-5 h-5 text-sky-600" />,
      bg: "bg-sky-500/10",
    },
    {
      label: "Hizmet Çeşidi",
      value: hizmetler.filter((h) => h.aktif).length,
      desc: "Aktif sunulan uygulamalar",
      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-3xl font-bold text-obsidian tracking-wide uppercase">
          Yönetim Dashboard
        </h2>
        <p className="text-xs text-charcoal/60 font-light">
          Salonun genel durumuna ait anlık rakamlar ve son işlemler.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} padding="md" className="bg-white flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-charcoal/50 uppercase tracking-wider font-semibold font-body">
                {stat.label}
              </span>
              <span className="text-2xl font-display font-bold text-obsidian tracking-wide">
                {stat.value}
              </span>
              <span className="text-[10px] text-charcoal/40 font-light mt-0.5">{stat.desc}</span>
            </div>
            <div className={`p-3 rounded-full ${stat.bg}`}>{stat.icon}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SVG Performance Chart (100% Edge/Server Safe) */}
        <div className="lg:col-span-7">
          <Card padding="lg" className="bg-white flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-champagne/30 pb-4">
              <div className="flex flex-col gap-0.5">
                <h3 className="font-display text-lg font-bold text-obsidian uppercase tracking-wider">
                  Gelir Trendi
                </h3>
                <span className="text-[10px] text-charcoal/50">Son işlemlerden elde edilen dağılım</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Kararlı Büyüme</span>
              </div>
            </div>

            {/* Custom Responsive SVG Graph */}
            <div className="w-full h-64 flex items-center justify-center relative">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Definitions for gradients */}
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5E83" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#8B5E83" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="170" x2="500" y2="170" stroke="#F5ECD7" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#F5ECD7" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="#F5ECD7" strokeWidth="1" strokeDasharray="4" />

                {/* Filled Area */}
                <path
                  d="M 0 170 Q 100 130, 200 90 T 400 60 L 500 40 L 500 200 L 0 200 Z"
                  fill="url(#chartGlow)"
                />

                {/* Line Path */}
                <path
                  d="M 0 170 Q 100 130, 200 90 T 400 60 L 500 40"
                  fill="none"
                  stroke="#8B5E83"
                  strokeWidth="2.5"
                />

                {/* Dots along path */}
                <circle cx="200" cy="90" r="4" fill="#8B5E83" />
                <circle cx="400" cy="60" r="4" fill="#8B5E83" />
                <circle cx="500" cy="40" r="4" fill="#8B5E83" />
              </svg>

              {/* Custom Y Axis Indicators */}
              <div className="absolute left-2 top-2 flex flex-col justify-between h-[90%] text-[8px] uppercase tracking-widest font-semibold text-charcoal/40">
                <span>{totalIncome} TL</span>
                <span>{Math.floor(totalIncome / 2)} TL</span>
                <span>0 TL</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Bookings List */}
        <div className="lg:col-span-5">
          <Card padding="lg" className="bg-white flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-champagne/30 pb-4">
              <div className="flex flex-col gap-0.5">
                <h3 className="font-display text-lg font-bold text-obsidian uppercase tracking-wider">
                  Son Rezervasyonlar
                </h3>
                <span className="text-[10px] text-charcoal/50">Sisteme düşen son 5 işlem</span>
              </div>
              <Link href="/panel/randevular">
                <Button variant="ghost" size="sm" className="text-xs px-2.5">
                  Tümü
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            {/* List */}
            <div className="flex flex-col gap-4">
              {recentBookings.map((booking) => {
                const s = hizmetler.find((h) => h.id === booking.hizmet_id);
                const p = personel.find((staff) => staff.id === booking.personel_id);
                
                const statuses = {
                  beklemede: "warning",
                  onaylandi: "success",
                  tamamlandi: "info",
                  reddedildi: "danger",
                  iptal: "neutral",
                } as const;

                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between border-b border-champagne/10 pb-3 last:border-0 last:pb-0 text-xs"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-obsidian">
                        {s ? s.ad : "Bilinmeyen Hizmet"}
                      </span>
                      <span className="text-[10px] text-charcoal/50">
                        Tarih: {booking.tarih.split("-").reverse().join(".")} saat {booking.baslangic_saati}
                      </span>
                      <span className="text-[9px] text-mauve/80 italic">Uzman: {p ? p.ad : "Farketmez"}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="font-bold text-obsidian">{booking.toplam_fiyat} TL</span>
                      <Badge variant={statuses[booking.durum] || "neutral"}>
                        {booking.durum}
                      </Badge>
                    </div>
                  </div>
                );
              })}

              {recentBookings.length === 0 && (
                <div className="text-center py-8 text-charcoal/50 italic">
                  Kayıtlı randevu bulunmuyor.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
