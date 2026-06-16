"use client";

import React, { useState } from "react";
import { Randevu, Hizmet, Personel, Musteri } from "../../../../lib/db/jsonDb";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import { useToast } from "../../../../components/ui/Toast";
import { Check, X, CheckSquare, Trash2, Search, Filter } from "lucide-react";

interface AppointmentsListClientProps {
  initialAppointments: Randevu[];
  services: Hizmet[];
  staff: Personel[];
  customers: Musteri[];
}

export default function AppointmentsListClient({
  initialAppointments,
  services,
  staff,
  customers,
}: AppointmentsListClientProps) {
  const [appointments, setAppointments] = useState<Randevu[]>(initialAppointments);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Hepsi");
  const { showToast } = useToast();

  const handleUpdateStatus = async (id: string, newStatus: Randevu["durum"]) => {
    try {
      const res = await fetch(`/api/randevular/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durum: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setAppointments((prev) => prev.map((item) => (item.id === id ? updated : item)));
        showToast(`Randevu durumu "${newStatus}" olarak güncellendi`, "success");
      } else {
        showToast("Durum güncellenirken hata oluştu", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu randevuyu silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/randevular/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAppointments((prev) => prev.filter((item) => item.id !== id));
        showToast("Randevu kaydı silindi", "success");
      } else {
        showToast("Randevu silinemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    }
  };

  const getCustomerName = (custId: string) => {
    const c = customers.find((cust) => cust.id === custId);
    return c ? c.ad : "Bilinmeyen Müşteri";
  };

  const getCustomerPhone = (custId: string) => {
    const c = customers.find((cust) => cust.id === custId);
    return c ? c.telefon : "";
  };

  const getServiceName = (serviceId: string) => {
    const s = services.find((serv) => serv.id === serviceId);
    return s ? s.ad : "Bilinmeyen Hizmet";
  };

  const getStaffName = (staffId: string) => {
    const p = staff.find((st) => st.id === staffId);
    return p ? p.ad : "Farketmez / Belirtilmemiş";
  };

  // Filter & Search Logic
  const filteredAppointments = appointments.filter((item) => {
    const custName = getCustomerName(item.musteri_id).toLowerCase();
    const query = searchQuery.toLowerCase();
    
    // Search match
    const matchesSearch = custName.includes(query) || item.id.toLowerCase().includes(query);
    
    // Tab match
    if (activeFilter === "Hepsi") return matchesSearch;
    if (activeFilter === "Bekleyenler") return matchesSearch && item.durum === "beklemede";
    if (activeFilter === "Onaylılar") return matchesSearch && item.durum === "onaylandi";
    if (activeFilter === "Tamamlananlar") return matchesSearch && item.durum === "tamamlandi";
    if (activeFilter === "İptal/Red") return matchesSearch && (item.durum === "iptal" || item.durum === "reddedildi");
    
    return matchesSearch;
  });

  const filterTabs = ["Hepsi", "Bekleyenler", "Onaylılar", "Tamamlananlar", "İptal/Red"];

  const statuses = {
    beklemede: "warning",
    onaylandi: "success",
    tamamlandi: "info",
    reddedildi: "danger",
    iptal: "neutral",
  } as const;

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 border border-champagne/60 rounded-sm">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Müşteri adı veya ID ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-ivory border border-champagne rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-mauve focus:border-mauve"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 ml-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-semibold border transition-all rounded-sm cursor-pointer ${
                activeFilter === tab
                  ? "bg-mauve border-mauve text-white"
                  : "bg-white border-champagne text-charcoal/60 hover:border-mauve hover:text-mauve"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table Card (Desktop) */}
      <div className="bg-white border border-champagne/60 shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-champagne/20 border-b border-champagne/30 text-[10px] uppercase tracking-widest font-bold text-charcoal/70">
                <th className="p-4">ID / Müşteri</th>
                <th className="p-4">Hizmet / Uzman</th>
                <th className="p-4">Tarih & Saat</th>
                <th className="p-4">Tutar</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-champagne/10 hover:bg-champagne/5 transition-all"
                >
                  {/* Customer Info */}
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-obsidian">
                        {getCustomerName(item.musteri_id)}
                      </span>
                      <span className="text-[10px] text-charcoal/50">{getCustomerPhone(item.musteri_id)}</span>
                      <span className="text-[9px] text-charcoal/40 font-mono mt-0.5">{item.id}</span>
                    </div>
                  </td>

                  {/* Service & Staff */}
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-obsidian">
                        {getServiceName(item.hizmet_id)}
                      </span>
                      <span className="text-[10px] text-mauve/90 italic">
                        {getStaffName(item.personel_id)}
                      </span>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5 text-charcoal/80">
                      <span>{item.tarih.split("-").reverse().join(".")}</span>
                      <span className="font-semibold text-obsidian">
                        {item.baslangic_saati} - {item.bitis_saati}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="p-4 font-bold text-obsidian">{item.toplam_fiyat} TL</td>

                  {/* Status */}
                  <td className="p-4">
                    <select
                      value={item.durum}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value as Randevu["durum"])}
                      className={`px-2 py-1 bg-white border border-champagne text-[10px] rounded-sm focus:outline-none focus:ring-1 focus:ring-mauve focus:border-mauve cursor-pointer font-bold uppercase tracking-wider transition-colors ${
                        item.durum === "beklemede"
                          ? "text-amber-600 bg-amber-50 border-amber-200"
                          : item.durum === "onaylandi"
                          ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                          : item.durum === "tamamlandi"
                          ? "text-purple-600 bg-purple-50 border-purple-200"
                          : item.durum === "reddedildi"
                          ? "text-rose-600 bg-rose-50 border-rose-200"
                          : "text-slate-600 bg-slate-50 border-slate-200"
                      }`}
                    >
                      <option value="beklemede">Beklemede</option>
                      <option value="onaylandi">Onaylandı</option>
                      <option value="tamamlandi">Tamamlandı</option>
                      <option value="reddedildi">Reddedildi</option>
                      <option value="iptal">İptal</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right flex items-center justify-end gap-1.5 h-full mt-2">
                    {item.durum === "beklemede" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(item.id, "onaylandi")}
                          title="Randevuyu Onayla"
                          className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 rounded-sm transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(item.id, "reddedildi")}
                          title="Randevuyu Reddet"
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border border-rose-500/20 rounded-sm transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {item.durum === "onaylandi" && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, "tamamlandi")}
                        title="İşlem Tamamlandı"
                        className="p-1.5 bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white border border-sky-500/20 rounded-sm transition-all cursor-pointer"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Randevuyu Sil"
                      className="p-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-sm transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-charcoal/50 italic">
                    Gösterilecek randevu bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Appointments Card List */}
      <div className="flex flex-col gap-4 md:hidden">
        {filteredAppointments.map((item) => {
          const custName = getCustomerName(item.musteri_id);
          const custPhone = getCustomerPhone(item.musteri_id);
          const serviceName = getServiceName(item.hizmet_id);
          const staffName = getStaffName(item.personel_id);
          const formattedDate = item.tarih.split("-").reverse().join(".");

          return (
            <div
              key={item.id}
              className="bg-white border border-champagne/60 p-4 rounded-sm shadow-sm flex flex-col gap-3 text-xs text-left"
            >
              {/* ID & Status */}
              <div className="flex items-center justify-between border-b border-champagne/20 pb-2">
                <span className="font-mono text-[10px] text-charcoal/50">ID: {item.id}</span>
                <select
                  value={item.durum}
                  onChange={(e) => handleUpdateStatus(item.id, e.target.value as Randevu["durum"])}
                  className={`px-2 py-1 bg-white border border-champagne text-[10px] rounded-sm focus:outline-none focus:ring-1 focus:ring-mauve focus:border-mauve cursor-pointer font-bold uppercase tracking-wider transition-colors ${
                    item.durum === "beklemede"
                      ? "text-amber-600 bg-amber-50 border-amber-200"
                      : item.durum === "onaylandi"
                      ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                      : item.durum === "tamamlandi"
                      ? "text-purple-600 bg-purple-50 border-purple-200"
                      : item.durum === "reddedildi"
                      ? "text-rose-600 bg-rose-50 border-rose-200"
                      : "text-slate-600 bg-slate-50 border-slate-200"
                  }`}
                >
                  <option value="beklemede">Beklemede</option>
                  <option value="onaylandi">Onaylandı</option>
                  <option value="tamamlandi">Tamamlandı</option>
                  <option value="reddedildi">Reddedildi</option>
                  <option value="iptal">İptal</option>
                </select>
              </div>

              {/* Customer */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] uppercase tracking-wider text-charcoal/40 font-semibold">Müşteri</span>
                <span className="font-bold text-obsidian text-sm">{custName}</span>
                {custPhone && <span className="text-charcoal/60">{custPhone}</span>}
              </div>

              {/* Service & Staff */}
              <div className="grid grid-cols-2 gap-2 border-t border-b border-champagne/10 py-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-charcoal/40 font-semibold">Hizmet</span>
                  <span className="font-semibold text-obsidian">{serviceName}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-charcoal/40 font-semibold">Uzman</span>
                  <span className="font-medium text-mauve/90 italic">{staffName}</span>
                </div>
              </div>

              {/* Date & Price */}
              <div className="flex justify-between items-center bg-ivory/40 p-2.5 rounded-sm">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-charcoal/40 font-semibold">Tarih & Saat</span>
                  <span className="font-semibold text-obsidian">
                    {formattedDate} @ {item.baslangic_saati} - {item.bitis_saati}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-charcoal/40 font-semibold">Tutar</span>
                  <span className="font-bold text-obsidian text-sm">{item.toplam_fiyat} TL</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-champagne/20">
                {item.durum === "beklemede" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(item.id, "onaylandi")}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 rounded-sm font-semibold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Onayla
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item.id, "reddedildi")}
                      className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border border-rose-500/20 rounded-sm font-semibold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Reddet
                    </button>
                  </>
                )}

                {item.durum === "onaylandi" && (
                  <button
                    onClick={() => handleUpdateStatus(item.id, "tamamlandi")}
                    className="px-3 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white border border-sky-500/20 rounded-sm font-semibold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <CheckSquare className="w-3.5 h-3.5" /> Tamamlandı
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-sm font-semibold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Sil
                </button>
              </div>
            </div>
          );
        })}

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12 bg-white border border-champagne/60 text-charcoal/50 italic rounded-sm">
            Gösterilecek randevu bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );
}
