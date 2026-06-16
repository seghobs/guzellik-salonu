"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";
import { Calendar, User, Phone, Mail, Award, Clock, DollarSign } from "lucide-react";

interface Appointment {
  id: string;
  tarih: string;
  baslangic_saati: string;
  bitis_saati: string;
  toplam_fiyat: number;
  durum: string;
  hizmet_ad: string;
  hizmet_gorsel: string;
  personel_ad: string;
  personel_unvan: string;
}

interface Member {
  id: string;
  ad: string;
  email: string;
  telefon: string;
  dogum_tarihi?: string;
  ilk_ziyaret: string;
  son_ziyaret: string;
  toplam_ziyaret: number;
  toplam_harcama: number;
}

export default function ProfilPage() {
  const [member, setMember] = useState<Member | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  // Profile Edit form states
  const [form, setForm] = useState({
    ad: "",
    telefon: "",
    dogum_tarihi: "",
  });

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/uye/profil");
      if (res.ok) {
        const data = await res.json();
        setMember(data.member);
        setAppointments(data.appointments);
        setForm({
          ad: data.member.ad,
          telefon: data.member.telefon,
          dogum_tarihi: data.member.dogum_tarihi || "",
        });
      } else {
        showToast("Profil yüklenemedi. Oturumunuz kapanmış olabilir.", "error");
        window.location.href = "/";
      }
    } catch (err) {
      showToast("Bir ağ hatası oluştu.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ad || !form.telefon) {
      showToast("Ad ve telefon alanları zorunludur.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/uye/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        setMember((prev) => (prev ? { ...prev, ...data.member } : null));
        showToast("Profil bilgileriniz başarıyla güncellendi.", "success");
        setIsEditing(false);
      } else {
        const data = await res.json();
        showToast(data.message || "Güncelleme başarısız oldu.", "error");
      }
    } catch (err) {
      showToast("Bağlantı hatası oluştu.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; style: string } } = {
      beklemede: { label: "Beklemede", style: "bg-amber-100 text-amber-800 border-amber-200" },
      onaylandi: { label: "Onaylandı", style: "bg-emerald-100 text-emerald-800 border-emerald-200" },
      reddedildi: { label: "Reddedildi", style: "bg-rose-100 text-rose-800 border-rose-200" },
      tamamlandi: { label: "Tamamlandı", style: "bg-purple-100 text-purple-800 border-purple-200" },
      iptal: { label: "İptal Edildi", style: "bg-slate-100 text-slate-800 border-slate-200" },
    };

    const s = statusMap[status] || { label: status, style: "bg-slate-100 text-slate-800 border-slate-200" };
    return (
      <span className={`px-2.5 py-1 rounded-sm text-[10px] uppercase font-bold tracking-wider border ${s.style}`}>
        {s.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-ivory min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!member) return null;

  return (
    <div className="bg-ivory min-h-screen pb-24">
      <PageHero
        title="Hesabım & Profil"
        subtitle="Randevularınızı takip edin, kişisel bilgilerinizi yönetin."
        backgroundImage="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
      />

      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Profile Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card padding="lg" className="bg-white border border-champagne/80 flex flex-col gap-6 shadow-md">
            <div className="flex flex-col items-center gap-2 text-center pb-6 border-b border-champagne/20">
              <div className="w-20 h-20 bg-mauve/10 rounded-full flex items-center justify-center text-mauve">
                <User className="w-10 h-10" />
              </div>
              <h3 className="font-display text-xl font-bold text-obsidian tracking-wide uppercase">
                {member.ad}
              </h3>
              <span className="text-xs text-mauve font-semibold uppercase tracking-wider font-body bg-mauve/5 px-3 py-1 rounded-full">
                Luxe Üye
              </span>
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
                <Input
                  label="Ad Soyad"
                  name="ad"
                  required
                  value={form.ad}
                  onChange={handleInputChange}
                />
                <Input
                  label="Telefon"
                  name="telefon"
                  required
                  value={form.telefon}
                  onChange={handleInputChange}
                />
                <Input
                  label="Doğum Tarihi"
                  name="dogum_tarihi"
                  type="date"
                  value={form.dogum_tarihi}
                  onChange={handleInputChange}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    isLoading={isSaving}
                  >
                    Kaydet
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    İptal
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-4 font-body text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-mauve shrink-0" />
                  <span className="text-charcoal truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-mauve shrink-0" />
                  <span className="text-charcoal">{member.telefon}</span>
                </div>
                {member.dogum_tarihi && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-mauve shrink-0" />
                    <span className="text-charcoal">
                      {member.dogum_tarihi.split("-").reverse().join(".")}
                    </span>
                  </div>
                )}
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Bilgilerimi Güncelle
                </Button>
              </div>
            )}
          </Card>

          {/* Member stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card padding="md" className="bg-white border border-champagne/80 text-center flex flex-col items-center justify-center shadow-sm">
              <Award className="w-6 h-6 text-mauve mb-2" />
              <span className="text-2xl font-bold text-obsidian">{member.toplam_ziyaret}</span>
              <span className="text-[10px] text-charcoal/50 uppercase tracking-widest font-bold font-body">Ziyaret</span>
            </Card>
            <Card padding="md" className="bg-white border border-champagne/80 text-center flex flex-col items-center justify-center shadow-sm">
              <DollarSign className="w-6 h-6 text-mauve mb-2" />
              <span className="text-2xl font-bold text-obsidian">{member.toplam_harcama} TL</span>
              <span className="text-[10px] text-charcoal/50 uppercase tracking-widest font-bold font-body">Harcama</span>
            </Card>
          </div>
        </div>

        {/* Right column: Appointments History */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card padding="lg" className="bg-white border border-champagne/80 flex flex-col gap-6 shadow-md min-h-[500px]">
            <h3 className="font-display text-xl font-bold text-obsidian tracking-wide uppercase border-b border-champagne/20 pb-4">
              Randevu Geçmişim
            </h3>

            {appointments.length > 0 ? (
              <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
                {appointments.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-champagne/40 rounded-sm hover:border-mauve/20 transition-all duration-300 gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {app.hizmet_gorsel && (
                        <div className="w-16 h-16 rounded-sm overflow-hidden bg-champagne/20 shrink-0 hidden sm:block">
                          <img
                            src={app.hizmet_gorsel}
                            alt={app.hizmet_ad}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-bold text-mauve uppercase tracking-widest font-body">
                          {app.id}
                        </span>
                        <h4 className="font-display text-base font-bold text-obsidian leading-snug">
                          {app.hizmet_ad}
                        </h4>
                        <span className="text-xs text-charcoal/80 font-body mt-0.5">
                          Uzman: <span className="font-semibold text-charcoal">{app.personel_ad}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col md:items-end justify-between items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-champagne/20">
                      <div className="flex items-center gap-2 text-xs font-semibold text-charcoal font-body">
                        <Calendar className="w-3.5 h-3.5 text-mauve" />
                        <span>{app.tarih.split("-").reverse().join(".")}</span>
                        <Clock className="w-3.5 h-3.5 text-mauve ml-1" />
                        <span>{app.baslangic_saati}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-xs font-bold text-obsidian">{app.toplam_fiyat} TL</span>
                        {getStatusBadge(app.durum)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-charcoal/50 text-sm">
                <Calendar className="w-12 h-12 text-champagne mb-4 animate-pulse" />
                <p className="font-medium">Henüz kayıtlı bir randevunuz bulunmamaktadır.</p>
                <Link href="/randevu" className="mt-4">
                  <Button variant="primary" size="sm"> Randevu Oluştur </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
