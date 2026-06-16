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
import { Trash2, Edit, Search, UserCheck } from "lucide-react";

interface CustomersManageClientProps {
  initialCustomers: Musteri[];
}

const customerSchema = z.object({
  ad: z.string().min(3, "Müşteri adı en az 3 karakter olmalıdır"),
  telefon: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  dogum_tarihi: z.string().optional().or(z.literal("")),
  notlar: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomersManageClient({ initialCustomers }: CustomersManageClientProps) {
  const [customers, setCustomers] = useState<Musteri[]>(initialCustomers);
  const [editingCustomer, setEditingCustomer] = useState<Musteri | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      ad: "",
      telefon: "",
      email: "",
      dogum_tarihi: "",
      notlar: "",
    },
  });

  const openEditModal = (customer: Musteri) => {
    setEditingCustomer(customer);
    reset({
      ad: customer.ad,
      telefon: customer.telefon,
      email: customer.email,
      dogum_tarihi: customer.dogum_tarihi || "",
      notlar: customer.notlar || "",
    });
  };

  const handleCloseModal = () => {
    setEditingCustomer(null);
    reset();
  };

  const handleEditCustomer = async (data: CustomerFormData) => {
    if (!editingCustomer) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/musteriler?id=${editingCustomer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...updated } : c)));
        showToast("Müşteri bilgileri başarıyla güncellendi", "success");
        handleCloseModal();
      } else {
        showToast("Müşteri güncellenemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu müşteriyi veritabanından tamamen silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/musteriler?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
        showToast("Müşteri kaydı silindi", "success");
      } else {
        showToast("Müşteri silinemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    }
  };

  // Filtered customers list
  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;
    const term = searchTerm.toLowerCase();
    return customers.filter(
      (c) =>
        c.ad.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.telefon.includes(term)
    );
  }, [customers, searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar */}
      <div className="flex items-center gap-2 border border-champagne/60 bg-white px-3 py-2 rounded-sm shadow-sm max-w-md w-full">
        <Search className="w-4 h-4 text-charcoal/40" />
        <input
          type="text"
          placeholder="Müşteri adı, e-posta veya telefon ile arayın..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs outline-none bg-transparent text-charcoal"
        />
      </div>

      {/* Customers Table Card (Desktop) */}
      <div className="bg-white border border-champagne/60 shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-champagne/20 border-b border-champagne/30 text-[10px] uppercase tracking-widest font-bold text-charcoal/70">
                <th className="p-4">Misafir Bilgisi</th>
                <th className="p-4">Doğum Tarihi</th>
                <th className="p-4">İlk Ziyaret</th>
                <th className="p-4">Son Ziyaret</th>
                <th className="p-4">Toplam Ziyaret</th>
                <th className="p-4">Toplam Harcama</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((item) => {
                const firstDate = new Date(item.ilk_ziyaret).toLocaleDateString("tr-TR");
                const lastDate = new Date(item.son_ziyaret).toLocaleDateString("tr-TR");

                return (
                  <tr
                    key={item.id}
                    className="border-b border-champagne/10 hover:bg-champagne/5 transition-all animate-fade-in"
                  >
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-obsidian">{item.ad}</span>
                          {item.kayitli_uye && (
                            <span className="px-1.5 py-0.5 bg-mauve/10 border border-mauve/20 text-mauve text-[8px] font-extrabold uppercase tracking-wider rounded-sm">
                              Kayıtlı Üye
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-charcoal/50">{item.email}</span>
                        <span className="text-[10px] text-charcoal/50">{item.telefon}</span>
                      </div>
                    </td>

                    <td className="p-4 text-charcoal/80">
                      {item.dogum_tarihi
                        ? item.dogum_tarihi.split("-").reverse().join(".")
                        : "Belirtilmemiş"}
                    </td>

                    <td className="p-4 text-charcoal/60">{firstDate}</td>

                    <td className="p-4 text-charcoal/80 font-semibold">{lastDate}</td>

                    <td className="p-4 text-charcoal/80 font-bold text-center">{item.toplam_ziyaret}</td>

                    <td className="p-4 font-bold text-mauve">{item.toplam_harcama} TL</td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          title="Düzenle"
                          className="p-1.5 bg-champagne/40 text-mauve hover:bg-mauve hover:text-white border border-mauve/20 rounded-sm transition-all cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Sil"
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-sm transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-charcoal/50 italic">
                    Kayıtlı müşteri bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Customers Card List */}
      <div className="flex flex-col gap-4 md:hidden animate-fade-in">
        {filteredCustomers.map((item) => {
          const firstDate = new Date(item.ilk_ziyaret).toLocaleDateString("tr-TR");
          const lastDate = new Date(item.son_ziyaret).toLocaleDateString("tr-TR");

          return (
            <div
              key={item.id}
              className="bg-white border border-champagne/60 p-4 rounded-sm shadow-sm flex flex-col gap-3 text-xs text-left"
            >
              {/* Name and Member badge */}
              <div className="flex items-start justify-between border-b border-champagne/20 pb-2">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-obsidian text-sm">{item.ad}</span>
                  <span className="font-mono text-[9px] text-charcoal/40">ID: {item.id}</span>
                </div>
                {item.kayitli_uye && (
                  <span className="px-1.5 py-0.5 bg-mauve/10 border border-mauve/20 text-mauve text-[8px] font-extrabold uppercase tracking-wider rounded-sm">
                    Kayıtlı Üye
                  </span>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-1 text-[11px] text-charcoal/80">
                <div className="flex justify-between">
                  <span className="text-charcoal/50">E-posta:</span>
                  <span className="font-medium text-obsidian truncate max-w-[200px]">{item.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/50">Telefon:</span>
                  <span className="font-medium text-obsidian">{item.telefon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/50">Doğum Tarihi:</span>
                  <span className="font-medium text-obsidian">
                    {item.dogum_tarihi
                      ? item.dogum_tarihi.split("-").reverse().join(".")
                      : "Belirtilmemiş"}
                  </span>
                </div>
              </div>

              {/* Visits history */}
              <div className="grid grid-cols-2 gap-2 border-t border-b border-champagne/10 py-2 text-[11px]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-charcoal/40 font-semibold">İlk Ziyaret</span>
                  <span className="text-charcoal/80 font-medium">{firstDate}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-charcoal/40 font-semibold">Son Ziyaret</span>
                  <span className="text-obsidian font-semibold">{lastDate}</span>
                </div>
              </div>

              {/* Total visits and Total spending */}
              <div className="flex justify-between items-center bg-ivory/40 p-2.5 rounded-sm">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-charcoal/40 font-semibold">Toplam Ziyaret</span>
                  <span className="font-bold text-obsidian">{item.toplam_ziyaret} Kez</span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-charcoal/40 font-semibold">Toplam Harcama</span>
                  <span className="font-bold text-mauve text-sm">{item.toplam_harcama} TL</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 border-t border-champagne/20 pt-2 mt-1">
                <button
                  onClick={() => openEditModal(item)}
                  className="px-3 py-1.5 bg-champagne/40 text-mauve hover:bg-mauve hover:text-white border border-mauve/20 rounded-sm font-semibold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Düzenle
                </button>
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

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12 bg-white border border-champagne/60 text-charcoal/50 italic rounded-sm">
            Kayıtlı müşteri bulunamadı.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editingCustomer} onClose={handleCloseModal} title="Müşteri Bilgilerini Düzenle">
        <form onSubmit={handleSubmit(handleEditCustomer)} className="flex flex-col gap-5 text-left animate-fade-in">
          <Input
            label="Ad Soyad *"
            placeholder="Müşterinin adı soyadı"
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

          <Input
            label="Doğum Tarihi"
            type="date"
            error={errors.dogum_tarihi?.message}
            {...register("dogum_tarihi")}
          />

          <Input
            label="Notlar / Özel Durumlar (İsteğe Bağlı)"
            multiline
            placeholder="Müşterinin saç/cilt hassasiyetleri, tercihleri vb."
            error={errors.notlar?.message}
            rows={3}
            {...register("notlar")}
          />

          <div className="flex items-center gap-3 justify-end pt-4 border-t border-champagne/30 mt-2">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              İptal
            </Button>
            <Button type="submit" isLoading={isSubmitting} variant="primary">
              Müşteriyi Kaydet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
