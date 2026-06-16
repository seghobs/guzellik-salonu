"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Hizmet } from "../../../../lib/db/jsonDb";
import { Card } from "../../../../components/ui/Card";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Select } from "../../../../components/ui/Select";
import { Modal } from "../../../../components/ui/Modal";
import { useToast } from "../../../../components/ui/Toast";
import { Trash2, Plus, Sparkles, Clock, Tag, ToggleLeft, ToggleRight, Edit } from "lucide-react";

interface ServicesManageClientProps {
  initialServices: Hizmet[];
}

const serviceSchema = z.object({
  ad: z.string().min(3, "Hizmet adı en az 3 karakter olmalıdır"),
  kategori: z.string().min(2, "Lütfen bir kategori seçin"),
  sure_dk: z.number().min(5, "Süre en az 5 dakika olmalıdır"),
  fiyat: z.number().min(1, "Fiyat 1 TL'den yüksek olmalıdır"),
  aciklama: z.string().min(5, "Açıklama en az 5 karakter olmalıdır"),
  detayli_aciklama: z.string().optional(),
  gorsel: z.string().min(1, "Lütfen bir görsel yükleyin"),
  aktif: z.boolean(),
  one_cikan: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function ServicesManageClient({ initialServices }: ServicesManageClientProps) {
  const [services, setServices] = useState<Hizmet[]>(initialServices);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingService, setEditingService] = useState<Hizmet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedGorsel, setUploadedGorsel] = useState<string>("");

  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      ad: "",
      kategori: "El & Tırnak",
      sure_dk: 60,
      fiyat: 100,
      aciklama: "",
      detayli_aciklama: "",
      gorsel: "",
      aktif: true,
      one_cikan: false,
    },
  });

  const openAddModal = () => {
    reset({
      ad: "",
      kategori: "El & Tırnak",
      sure_dk: 60,
      fiyat: 100,
      aciklama: "",
      detayli_aciklama: "",
      gorsel: "",
      aktif: true,
      one_cikan: false,
    });
    setUploadedGorsel("");
    setIsAddOpen(true);
  };

  const openEditModal = (service: Hizmet) => {
    setEditingService(service);
    reset({
      ad: service.ad,
      kategori: service.kategori,
      sure_dk: service.sure_dk,
      fiyat: service.fiyat,
      aciklama: service.aciklama,
      detayli_aciklama: service.detayli_aciklama || "",
      gorsel: service.gorsel,
      aktif: service.aktif,
      one_cikan: service.one_cikan,
    });
    setUploadedGorsel(service.gorsel);
  };

  const handleCloseModal = () => {
    setIsAddOpen(false);
    setEditingService(null);
    reset();
    setUploadedGorsel("");
  };

  const handleEditService = async (data: ServiceFormData) => {
    if (!editingService) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/hizmetler/${editingService.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updatedService = await res.json();
        setServices((prev) => prev.map((s) => (s.id === editingService.id ? updatedService : s)));
        showToast("Hizmet başarıyla güncellendi", "success");
        setEditingService(null);
        reset();
        setUploadedGorsel("");
      } else {
        showToast("Hizmet güncellenemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: ServiceFormData) => {
    if (editingService) {
      handleEditService(data);
    } else {
      handleAddService(data);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Görsel boyutu 2MB'tan küçük olmalıdır.", "error");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setUploadedGorsel(base64);
      setValue("gorsel", base64, { shouldValidate: true });
    };
  };

  const handleAddService = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/hizmetler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newService = await res.json();
        setServices((prev) => [...prev, newService]);
        showToast("Hizmet başarıyla listeye eklendi", "success");
        setIsAddOpen(false);
        reset();
        setUploadedGorsel("");
      } else {
        showToast("Hizmet eklenemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/hizmetler/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aktif: !currentStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
        showToast(`Hizmet durumu güncellendi`, "success");
      }
    } catch (err) {
      showToast("Durum değiştirilemedi", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu hizmeti menüden kaldırmak istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/hizmetler/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        showToast("Hizmet kaydı menüden kaldırıldı", "success");
      } else {
        showToast("Hizmet silinemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    }
  };

  const categoryOptions = [
    { value: "El & Tırnak", label: "El & Tırnak" },
    { value: "Cilt Bakımı", label: "Cilt Bakımı" },
    { value: "Saç", label: "Saç" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top action bar */}
      <div className="flex justify-end">
        <Button variant="primary" onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Yeni Hizmet Ekle
        </Button>
      </div>

      {/* Services Table Card (Desktop) */}
      <div className="bg-white border border-champagne/60 shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-champagne/20 border-b border-champagne/30 text-[10px] uppercase tracking-widest font-bold text-charcoal/70">
                <th className="p-4">Görsel / Hizmet Adı</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Süre</th>
                <th className="p-4">Fiyat</th>
                <th className="p-4">Durum / Öne Çıkan</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {services.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-champagne/10 hover:bg-champagne/5 transition-all"
                >
                  {/* Thumbnail & Title */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 overflow-hidden bg-champagne/20 rounded-sm">
                        <img
                          src={item.gorsel}
                          alt={item.ad}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-obsidian">{item.ad}</span>
                        <span className="text-[10px] text-charcoal/50 line-clamp-1 max-w-xs">{item.aciklama}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4">
                    <span className="font-semibold">{item.kategori}</span>
                  </td>

                  {/* Duration */}
                  <td className="p-4 flex items-center gap-1 h-full pt-6">
                    <Clock className="w-3.5 h-3.5 text-mauve" />
                    <span>{item.sure_dk} Dakika</span>
                  </td>

                  {/* Price */}
                  <td className="p-4 font-bold text-obsidian">{item.fiyat} TL</td>

                  {/* Badges */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(item.id, item.aktif)}
                        title={item.aktif ? "Pasifleştir" : "Aktifleştir"}
                        className="cursor-pointer"
                      >
                        {item.aktif ? (
                          <ToggleRight className="w-6 h-6 text-mauve" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-charcoal/30" />
                        )}
                      </button>
                      {item.one_cikan && (
                        <Badge variant="primary" className="text-[8px]">Öne Çıkan</Badge>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
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
              ))}

              {services.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-charcoal/50 italic">
                    Kayıtlı hizmet bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Services Card List */}
      <div className="flex flex-col gap-4 md:hidden">
        {services.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-champagne/60 p-4 rounded-sm shadow-sm flex flex-col gap-3 text-xs text-left"
          >
            {/* Header info - image & title */}
            <div className="flex items-center gap-3 pb-2 border-b border-champagne/20">
              <div className="w-12 h-12 shrink-0 overflow-hidden bg-champagne/20 rounded-sm">
                <img
                  src={item.gorsel}
                  alt={item.ad}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="font-bold text-obsidian text-sm truncate">{item.ad}</span>
                <span className="text-[10px] text-charcoal/50">{item.kategori}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-[11px] text-charcoal/70 leading-relaxed font-light">
              {item.aciklama}
            </p>

            {/* Duration and Price */}
            <div className="grid grid-cols-2 gap-2 bg-ivory/40 p-2 rounded-sm text-center">
              <div className="flex flex-col gap-0.5 items-center border-r border-champagne/20">
                <span className="text-[9px] uppercase tracking-wider text-charcoal/40 font-semibold">Süre</span>
                <span className="font-semibold text-obsidian flex items-center gap-1 justify-center">
                  <Clock className="w-3 h-3 text-mauve" /> {item.sure_dk} Dakika
                </span>
              </div>
              <div className="flex flex-col gap-0.5 items-center">
                <span className="text-[9px] uppercase tracking-wider text-charcoal/40 font-semibold">Fiyat</span>
                <span className="font-bold text-obsidian">{item.fiyat} TL</span>
              </div>
            </div>

            {/* Status indicators and Action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-champagne/20">
              <div className="flex items-center gap-4">
                {/* Active Toggle */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleActive(item.id, item.aktif)}
                    className="cursor-pointer"
                  >
                    {item.aktif ? (
                      <ToggleRight className="w-6 h-6 text-mauve" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-charcoal/30" />
                    )}
                  </button>
                  <span className="text-[10px] font-semibold text-charcoal/60">Aktif</span>
                </div>

                {/* Featured Badge */}
                {item.one_cikan && (
                  <Badge variant="primary" className="text-[8px]">Öne Çıkan</Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
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
          </div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-12 bg-white border border-champagne/60 text-charcoal/50 italic rounded-sm">
            Kayıtlı hizmet bulunmamaktadır.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddOpen || !!editingService}
        onClose={handleCloseModal}
        title={editingService ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 text-left">
          <Input
            label="Hizmet Adı *"
            placeholder="Hizmetin adını girin (Örn: Kalıcı Oje)"
            error={errors.ad?.message}
            {...register("ad")}
          />

          <Select
            label="Kategori *"
            options={categoryOptions}
            error={errors.kategori?.message}
            {...register("kategori")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Süre (Dakika) *"
              type="number"
              error={errors.sure_dk?.message}
              {...register("sure_dk", { valueAsNumber: true })}
            />
            <Input
              label="Fiyat (TL) *"
              type="number"
              error={errors.fiyat?.message}
              {...register("fiyat", { valueAsNumber: true })}
            />
          </div>

          <Input
            label="Kısa Açıklama *"
            placeholder="Ana sayfada ve kartlarda görünecek kısa açıklama"
            error={errors.aciklama?.message}
            {...register("aciklama")}
          />

          <Input
            label="Detaylı Açıklama (İsteğe Bağlı)"
            multiline
            placeholder="Hizmet detay sayfasında görüntülenecek zengin açıklama..."
            error={errors.detayli_aciklama?.message}
            rows={3}
            {...register("detayli_aciklama")}
          />

          <div className="flex flex-col gap-1.5 text-xs text-charcoal">
            <span className="font-semibold text-charcoal/70 uppercase tracking-widest text-[10px]">Hizmet Görseli *</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 border border-champagne p-3 bg-white rounded-sm">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="service-image-upload"
              />
              <label
                htmlFor="service-image-upload"
                className="px-4 py-2 border border-mauve text-mauve hover:bg-mauve hover:text-white transition-all rounded-sm font-semibold cursor-pointer uppercase tracking-wider text-[10px] shrink-0"
              >
                Dosya Seç
              </label>
              {uploadedGorsel ? (
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 shrink-0 overflow-hidden rounded-sm border border-champagne">
                    <img src={uploadedGorsel} alt="Önizleme" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase truncate">Görsel Seçildi</span>
                </div>
              ) : (
                <span className="text-charcoal/40 text-[10px] italic">Henüz dosya seçilmedi (Maks. 2MB)</span>
              )}
            </div>
            {errors.gorsel?.message && (
              <span className="text-xs text-rose-600 mt-1">{errors.gorsel.message}</span>
            )}
          </div>

          <div className="flex gap-6 pt-3">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-charcoal group select-none">
              <div className="relative flex items-center justify-center shrink-0">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  {...register("aktif")}
                />
                <div className="w-4 h-4 border border-champagne bg-white rounded-sm transition-all duration-300 peer-checked:bg-mauve peer-checked:border-mauve peer-focus-visible:ring-2 peer-focus-visible:ring-mauve/20 group-hover:border-mauve/60 flex items-center justify-center" />
                <svg
                  className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform duration-200 absolute pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span>Aktif Olarak Sun</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-charcoal group select-none">
              <div className="relative flex items-center justify-center shrink-0">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  {...register("one_cikan")}
                />
                <div className="w-4 h-4 border border-champagne bg-white rounded-sm transition-all duration-300 peer-checked:bg-mauve peer-checked:border-mauve peer-focus-visible:ring-2 peer-focus-visible:ring-mauve/20 group-hover:border-mauve/60 flex items-center justify-center" />
                <svg
                  className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform duration-200 absolute pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span>Ana Sayfada Öne Çıkar</span>
            </label>
          </div>

          <div className="flex items-center gap-3 justify-end pt-4 border-t border-champagne/30 mt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
              İptal
            </Button>
            <Button type="submit" isLoading={isSubmitting} variant="primary">
              Hizmeti Kaydet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
