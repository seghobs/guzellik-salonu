"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Personel, Hizmet } from "@/lib/db/jsonDb";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Trash2, Plus, Star, ToggleLeft, ToggleRight, CheckSquare, Edit } from "lucide-react";

interface StaffManageClientProps {
  initialStaff: Personel[];
  services: Hizmet[];
}

const staffSchema = z.object({
  ad: z.string().min(3, "Ad Soyad en az 3 karakter olmalıdır"),
  unvan: z.string().min(2, "Unvan en az 2 karakter olmalıdır"),
  bio: z.string().min(10, "Biyografi en az 10 karakter olmalıdır"),
  gorsel: z.string().min(1, "Lütfen bir görsel yükleyin"),
  uzmanlik_alanlari: z.string().min(2, "Lütfen en az bir uzmanlık alanı yazın (virgülle ayırın)"),
  hizmet_verdigi_hizmetler: z.array(z.string()).min(1, "En az bir hizmet seçilmelidir"),
  musait_gunler: z.array(z.string()).min(1, "En az bir çalışma günü seçilmelidir"),
  aktif: z.boolean(),
});

type StaffFormData = z.infer<typeof staffSchema>;

export default function StaffManageClient({ initialStaff, services }: StaffManageClientProps) {
  const [staffList, setStaffList] = useState<Personel[]>(initialStaff);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Personel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedGorsel, setUploadedGorsel] = useState<string>("");

  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      ad: "",
      unvan: "",
      bio: "",
      gorsel: "",
      uzmanlik_alanlari: "",
      hizmet_verdigi_hizmetler: [],
      musait_gunler: ["pazartesi", "sali", "carsamba", "persembe", "cuma"],
      aktif: true,
    },
  });

  const openAddModal = () => {
    reset({
      ad: "",
      unvan: "",
      bio: "",
      gorsel: "",
      uzmanlik_alanlari: "",
      hizmet_verdigi_hizmetler: [],
      musait_gunler: ["pazartesi", "sali", "carsamba", "persembe", "cuma"],
      aktif: true,
    });
    setUploadedGorsel("");
    setIsAddOpen(true);
  };

  const openEditModal = (staff: Personel) => {
    setEditingStaff(staff);
    reset({
      ad: staff.ad,
      unvan: staff.unvan,
      bio: staff.bio,
      gorsel: staff.gorsel,
      uzmanlik_alanlari: staff.uzmanlik_alanlari.join(", "),
      hizmet_verdigi_hizmetler: staff.hizmet_verdigi_hizmetler,
      musait_gunler: staff.musait_gunler,
      aktif: staff.aktif,
    });
    setUploadedGorsel(staff.gorsel);
  };

  const handleCloseModal = () => {
    setIsAddOpen(false);
    setEditingStaff(null);
    reset();
    setUploadedGorsel("");
  };

  const handleEditStaff = async (data: StaffFormData) => {
    if (!editingStaff) return;
    setIsSubmitting(true);
    try {
      const mappedSpecialties = data.uzmanlik_alanlari
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...data,
        uzmanlik_alanlari: mappedSpecialties,
      };

      const res = await fetch(`/api/personel?id=${editingStaff.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json();
        setStaffList((prev) => prev.map((p) => (p.id === editingStaff.id ? updated : p)));
        showToast("Personel bilgileri başarıyla güncellendi", "success");
        setEditingStaff(null);
        reset();
        setUploadedGorsel("");
      } else {
        showToast("Personel güncellenemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: StaffFormData) => {
    if (editingStaff) {
      handleEditStaff(data);
    } else {
      handleAddStaff(data);
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

  const handleAddStaff = async (data: StaffFormData) => {
    setIsSubmitting(true);
    try {
      // Split specialties by comma
      const mappedSpecialties = data.uzmanlik_alanlari
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...data,
        uzmanlik_alanlari: mappedSpecialties,
      };

      const res = await fetch("/api/personel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newStaff = await res.json();
        setStaffList((prev) => [...prev, newStaff]);
        showToast("Personel başarıyla kadroya eklendi", "success");
        setIsAddOpen(false);
        reset();
        setUploadedGorsel("");
      } else {
        showToast("Personel eklenemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/personel?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aktif: !currentStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setStaffList((prev) => prev.map((p) => (p.id === id ? updated : p)));
        showToast("Personel aktiflik durumu güncellendi", "success");
      }
    } catch (err) {
      showToast("Durum değiştirilemedi", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu personeli kadrodan silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/personel?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setStaffList((prev) => prev.filter((p) => p.id !== id));
        showToast("Personel kaydı silindi", "success");
      } else {
        showToast("Personel silinemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    }
  };

  const daysOfWeek = [
    { value: "pazartesi", label: "Pazartesi" },
    { value: "sali", label: "Salı" },
    { value: "carsamba", label: "Çarşamba" },
    { value: "persembe", label: "Perşembe" },
    { value: "cuma", label: "Cuma" },
    { value: "cumartesi", label: "Cumartesi" },
    { value: "pazar", label: "Pazar" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button variant="primary" onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Yeni Uzman Ekle
        </Button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((item) => (
          <Card key={item.id} padding="none" className="group bg-white flex flex-col justify-between h-[450px]">
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden bg-champagne/20">
              <img
                src={item.gorsel}
                alt={item.ad}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 px-2 py-0.5 text-xs font-semibold text-charcoal rounded-sm shadow-sm flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{item.puan.toFixed(1)} ({item.yorum_sayisi})</span>
              </div>
            </div>

            {/* Info details */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-3 text-left">
              <div className="flex flex-col gap-1.5">
                <div>
                  <h4 className="font-display font-bold text-base text-obsidian">
                    {item.ad}
                  </h4>
                  <span className="font-accent text-xs italic text-mauve font-medium">
                    {item.unvan}
                  </span>
                </div>
                <p className="text-[10px] text-charcoal/60 line-clamp-2 leading-relaxed font-light">
                  {item.bio}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.uzmanlik_alanlari.map((area) => (
                    <span key={area} className="text-[8px] bg-champagne/30 text-charcoal/80 px-1.5 py-0.5">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="border-t border-champagne/30 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
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
                  <span className="text-[10px] font-semibold text-charcoal/60">Aktif</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex items-center gap-1 text-xs text-mauve hover:text-mauve/80 font-semibold cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Düzenle</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sil</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {staffList.length === 0 && (
          <div className="col-span-3 text-center py-20 text-charcoal/50 italic border border-dashed border-champagne rounded-sm min-h-[300px]">
            Kayıtlı personel bulunmamaktadır.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddOpen || !!editingStaff}
        onClose={handleCloseModal}
        title={editingStaff ? "Uzman Bilgilerini Düzenle" : "Yeni Personel Ekle"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-left">
          <Input
            label="Ad Soyad *"
            placeholder="Personel Adı Soyadı"
            error={errors.ad?.message}
            {...register("ad")}
          />

          <Input
            label="Unvan *"
            placeholder="Baş Tırnak Uzmanı, Stilist vb."
            error={errors.unvan?.message}
            {...register("unvan")}
          />

          <Input
            label="Biyografi *"
            multiline
            placeholder="Personelin uzmanlıkları ve kariyer özeti..."
            error={errors.bio?.message}
            rows={3}
            {...register("bio")}
          />

          <Input
            label="Uzmanlık Alanları (Virgülle Ayırın) *"
            placeholder="Nail Art, Kalıcı Oje, Saç Kesim"
            error={errors.uzmanlik_alanlari?.message}
            {...register("uzmanlik_alanlari")}
          />

          <div className="flex flex-col gap-1.5 text-xs text-charcoal">
            <span className="font-semibold text-charcoal/70 uppercase tracking-widest text-[10px]">Uzman Fotoğrafı *</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 border border-champagne p-3 bg-white rounded-sm">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="staff-image-upload"
              />
              <label
                htmlFor="staff-image-upload"
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

          {/* Çalıştığı Günler Checkboxes */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest text-charcoal/70 font-semibold">Çalıştığı Günler *</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {daysOfWeek.map((day) => (
                <label key={day.value} className="flex items-center gap-2 cursor-pointer text-xs text-charcoal font-medium group select-none">
                  <div className="relative flex items-center justify-center shrink-0">
                    <input
                      type="checkbox"
                      value={day.value}
                      defaultChecked={day.value !== "pazar"}
                      className="peer sr-only"
                      {...register("musait_gunler")}
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
                  <span>{day.label}</span>
                </label>
              ))}
            </div>
            {errors.musait_gunler && (
              <span className="text-xs text-rose-600 mt-1">{errors.musait_gunler.message}</span>
            )}
          </div>

          {/* Yapabildiği Hizmetler Checkboxes */}
          <div className="flex flex-col gap-1.5 mt-2">
            <span className="text-xs uppercase tracking-widest text-charcoal/70 font-semibold">Verdiği Hizmet Yetkileri *</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-champagne/40 p-3 bg-white">
              {services.map((service) => (
                <label key={service.id} className="flex items-center gap-2 cursor-pointer text-xs text-charcoal font-medium group select-none">
                  <div className="relative flex items-center justify-center shrink-0">
                    <input
                      type="checkbox"
                      value={service.id}
                      className="peer sr-only"
                      {...register("hizmet_verdigi_hizmetler")}
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
                  <span>{service.ad}</span>
                </label>
              ))}
            </div>
            {errors.hizmet_verdigi_hizmetler && (
              <span className="text-xs text-rose-600 mt-1">{errors.hizmet_verdigi_hizmetler.message}</span>
            )}
          </div>

          <div className="flex items-center gap-3 justify-end pt-4 border-t border-champagne/30 mt-4">
            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
              İptal
            </Button>
            <Button type="submit" isLoading={isSubmitting} variant="primary">
              Uzmanı Kaydet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
