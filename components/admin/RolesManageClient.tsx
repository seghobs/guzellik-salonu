"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Musteri } from "@/lib/db/jsonDb";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Trash2, Edit, Search, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface RolesManageClientProps {
  initialMembers: Musteri[];
}

const roleSchema = z.object({
  ad: z.string().min(3, "Üye adı en az 3 karakter olmalıdır"),
  telefon: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  rol: z.enum(["admin", "uye"]),
});

type RoleFormData = z.infer<typeof roleSchema>;

export default function RolesManageClient({ initialMembers }: RolesManageClientProps) {
  const [members, setMembers] = useState<Musteri[]>(initialMembers);
  const [editingMember, setEditingMember] = useState<Musteri | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      ad: "",
      telefon: "",
      email: "",
      rol: "uye",
    },
  });

  const openEditModal = (member: Musteri) => {
    setEditingMember(member);
    reset({
      ad: member.ad,
      telefon: member.telefon,
      email: member.email,
      rol: (member.rol as "admin" | "uye") || "uye",
    });
  };

  const handleCloseModal = () => {
    setEditingMember(null);
    reset();
  };

  const handleEditMember = async (data: RoleFormData) => {
    if (!editingMember) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/musteriler?id=${editingMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setMembers((prev) => prev.map((m) => (m.id === editingMember.id ? { ...m, ...updated } : m)));
        showToast("Üye bilgileri ve yetkileri güncellendi", "success");
        handleCloseModal();
      } else {
        showToast("Üye güncellenemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleRole = async (member: Musteri) => {
    const currentRole = member.rol || "uye";
    const newRole = currentRole === "admin" ? "uye" : "admin";
    const confirmMessage = newRole === "admin"
      ? `"${member.ad}" kullanıcısını YÖNETİCİ yapmak istediğinize emin misiniz? Bu işlem panel erişim yetkisi verecektir.`
      : `"${member.ad}" kullanıcısının yönetici yetkisini kaldırmak istediğinize emin misiniz?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const res = await fetch(`/api/musteriler?id=${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad: member.ad,
          telefon: member.telefon,
          email: member.email,
          rol: newRole,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, ...updated } : m)));
        showToast(newRole === "admin" ? "Yönetici yetkisi atandı" : "Yönetici yetkisi kaldırıldı", "success");
      } else {
        showToast("Yetki güncellenemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu üyenin kaydını ve hesabını tamamen silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/musteriler?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        showToast("Üye hesabı tamamen silindi", "success");
      } else {
        showToast("Hesap silinemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    }
  };

  // Filtered members list
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return members;
    const term = searchTerm.toLowerCase();
    return members.filter(
      (m) =>
        m.ad.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        m.telefon.includes(term)
    );
  }, [members, searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar */}
      <div className="flex items-center gap-2 border border-champagne/60 bg-white px-3 py-2 rounded-sm shadow-sm max-w-md w-full">
        <Search className="w-4 h-4 text-charcoal/40" />
        <input
          type="text"
          placeholder="İsim, e-posta veya telefon ile arayın..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs outline-none bg-transparent text-charcoal"
        />
      </div>

      {/* Members Table Card (Desktop) */}
      <div className="bg-white border border-champagne/60 shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-champagne/20 border-b border-champagne/30 text-[10px] uppercase tracking-widest font-bold text-charcoal/70">
                <th className="p-4">Üye Bilgisi</th>
                <th className="p-4">Kayıt Tarihi</th>
                <th className="p-4">Sistem Rolü</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((item) => {
                const registerDate = item.uye_olma_tarihi
                  ? new Date(item.uye_olma_tarihi).toLocaleDateString("tr-TR")
                  : "Belirtilmemiş";
                const isItemAdmin = item.rol === "admin";

                return (
                  <tr
                    key={item.id}
                    className="border-b border-champagne/10 hover:bg-champagne/5 transition-all animate-fade-in text-charcoal"
                  >
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-obsidian text-sm">{item.ad}</span>
                        <span className="text-[10px] text-charcoal/50">{item.email}</span>
                        <span className="text-[10px] text-charcoal/50">{item.telefon}</span>
                      </div>
                    </td>

                    <td className="p-4 text-charcoal/60">{registerDate}</td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-sm text-[9px] uppercase font-extrabold tracking-wider border ${
                          isItemAdmin
                            ? "bg-mauve/10 text-mauve border-mauve/25 shadow-sm"
                            : "bg-slate-100 text-charcoal/60 border-slate-200"
                        }`}
                      >
                        {isItemAdmin ? "Yönetici (Admin)" : "Normal Üye"}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Quick Toggle Role */}
                        <button
                          onClick={() => handleToggleRole(item)}
                          title={isItemAdmin ? "Üye Yap" : "Yönetici Yap"}
                          className={`p-1.5 border rounded-sm transition-all cursor-pointer flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${
                            isItemAdmin
                              ? "bg-amber-50 border-amber-500/20 text-amber-700 hover:bg-amber-500 hover:text-white"
                              : "bg-mauve/5 border-mauve/20 text-mauve hover:bg-mauve hover:text-white shadow-sm"
                          }`}
                        >
                          {isItemAdmin ? (
                            <>
                              <ShieldAlert className="w-3.5 h-3.5" />
                              Yetkiyi Al
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Yönetici Yap
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => openEditModal(item)}
                          title="Düzenle"
                          className="p-1.5 bg-champagne/40 text-mauve hover:bg-mauve hover:text-white border border-mauve/20 rounded-sm transition-all cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Hesabı Sil"
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-sm transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-charcoal/50 italic">
                    Kayıtlı üye bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Members Card List */}
      <div className="flex flex-col gap-4 md:hidden animate-fade-in">
        {filteredMembers.map((item) => {
          const registerDate = item.uye_olma_tarihi
            ? new Date(item.uye_olma_tarihi).toLocaleDateString("tr-TR")
            : "Belirtilmemiş";
          const isItemAdmin = item.rol === "admin";

          return (
            <div
              key={item.id}
              className="bg-white border border-champagne/60 p-4 rounded-sm shadow-sm flex flex-col gap-3 text-xs text-left"
            >
              {/* Header: Name and role badge */}
              <div className="flex items-start justify-between border-b border-champagne/20 pb-2">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-obsidian text-sm">{item.ad}</span>
                  <span className="text-[10px] text-charcoal/40 font-mono">ID: {item.id}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-sm text-[8px] uppercase font-extrabold tracking-wider border ${
                    isItemAdmin
                      ? "bg-mauve/10 text-mauve border-mauve/20 shadow-sm"
                      : "bg-slate-100 text-charcoal/60 border-slate-200"
                  }`}
                >
                  {isItemAdmin ? "Admin" : "Üye"}
                </span>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-1 text-[11px] text-charcoal/80">
                <div className="flex justify-between">
                  <span className="text-charcoal/50">E-posta:</span>
                  <span className="font-medium text-obsidian">{item.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/50">Telefon:</span>
                  <span className="font-medium text-obsidian">{item.telefon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/50">Kayıt Tarihi:</span>
                  <span className="font-medium text-obsidian">{registerDate}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-champagne/20 pt-2.5 mt-1">
                <button
                  onClick={() => handleToggleRole(item)}
                  className={`px-2.5 py-1.5 border rounded-sm font-semibold transition-all cursor-pointer flex items-center gap-1 text-[10px] uppercase tracking-wider ${
                    isItemAdmin
                      ? "bg-amber-50 border-amber-500/20 text-amber-700 hover:bg-amber-500 hover:text-white"
                      : "bg-mauve/5 border-mauve/20 text-mauve hover:bg-mauve hover:text-white"
                  }`}
                >
                  {isItemAdmin ? (
                    <>
                      <ShieldAlert className="w-3 h-3" /> Yetkiyi Al
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3 h-3" /> Admin Yap
                    </>
                  )}
                </button>

                <button
                  onClick={() => openEditModal(item)}
                  className="px-2.5 py-1.5 bg-champagne/40 text-mauve hover:bg-mauve hover:text-white border border-mauve/20 rounded-sm font-semibold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" /> Düzenle
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-sm font-semibold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Sil
                </button>
              </div>
            </div>
          );
        })}

        {filteredMembers.length === 0 && (
          <div className="text-center py-12 bg-white border border-champagne/60 text-charcoal/50 italic rounded-sm">
            Kayıtlı üye bulunamadı.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editingMember} onClose={handleCloseModal} title="Üye Yetkilerini Düzenle">
        <form onSubmit={handleSubmit(handleEditMember)} className="flex flex-col gap-5 text-left animate-fade-in text-charcoal">
          <Input
            label="Ad Soyad *"
            placeholder="Üyenin adı soyadı"
            error={errors.ad?.message}
            {...register("ad")}
          />

          <Input
            label="Telefon *"
            placeholder="05xxxxxxxxx"
            error={errors.telefon?.message}
            {...register("telefon")}
          />

          <Input
            label="E-posta *"
            placeholder="ornek@domain.com"
            error={errors.email?.message}
            {...register("email")}
          />

          {/* Role Select Input */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[11px] font-bold uppercase tracking-widest text-charcoal/70">
              Sistem Rolü / Yetki *
            </label>
            <div className="relative">
              <select
                {...register("rol")}
                className="w-full bg-white border border-champagne rounded-sm px-3.5 py-3 text-xs outline-none text-charcoal/80 transition-all duration-300 focus:border-mauve/60 focus:ring-4 focus:ring-mauve/10"
              >
                <option value="uye">Normal Üye</option>
                <option value="admin">Yönetici (Admin)</option>
              </select>
            </div>
            {errors.rol && (
              <span className="text-[10px] text-red-500 font-bold">{errors.rol.message}</span>
            )}
          </div>

          <div className="flex items-center gap-3 justify-end pt-4 border-t border-champagne/30 mt-2">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              İptal
            </Button>
            <Button type="submit" isLoading={isSubmitting} variant="primary">
              Üye Bilgilerini Kaydet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
