"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GaleriItem } from "../../../../lib/db/jsonDb";
import { Card } from "../../../../components/ui/Card";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Select } from "../../../../components/ui/Select";
import { Modal } from "../../../../components/ui/Modal";
import { useToast } from "../../../../components/ui/Toast";
import { Trash2, Plus, Sparkles, Image as ImageIcon, Edit } from "lucide-react";

interface GalleryManageClientProps {
  initialItems: GaleriItem[];
}

const gallerySchema = z.object({
  baslik: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  kategori: z.string().min(2, "Lütfen bir kategori yazın veya seçin"),
  gorsel: z.string().min(1, "Lütfen bir görsel yükleyin"),
  one_cikan: z.boolean(),
  sira: z.number().min(1, "Sıra en az 1 olmalıdır"),
});

type GalleryFormData = z.infer<typeof gallerySchema>;

export default function GalleryManageClient({ initialItems }: GalleryManageClientProps) {
  const [items, setItems] = useState<GaleriItem[]>(initialItems);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GaleriItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedGorsel, setUploadedGorsel] = useState<string>("");
  
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      baslik: "",
      kategori: "Nail Art",
      gorsel: "",
      one_cikan: false,
      sira: 1,
    },
  });

  const openAddModal = () => {
    reset({
      baslik: "",
      kategori: "Nail Art",
      gorsel: "",
      one_cikan: false,
      sira: 1,
    });
    setUploadedGorsel("");
    setIsAddOpen(true);
  };

  const openEditModal = (item: GaleriItem) => {
    setEditingItem(item);
    reset({
      baslik: item.baslik,
      kategori: item.kategori,
      gorsel: item.gorsel,
      one_cikan: item.one_cikan,
      sira: item.sira,
    });
    setUploadedGorsel(item.gorsel);
  };

  const handleCloseModal = () => {
    setIsAddOpen(false);
    setEditingItem(null);
    reset();
    setUploadedGorsel("");
  };

  const handleEditPhoto = async (data: GalleryFormData) => {
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/galeri?id=${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setItems((prev) => prev.map((item) => (item.id === editingItem.id ? updated : item)).sort((a, b) => a.sira - b.sira));
        showToast("Görsel başarıyla güncellendi", "success");
        setEditingItem(null);
        reset();
      } else {
        showToast("Görsel güncellenemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    } finally {
      setIsSubmitting(false);
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

  const onSubmit = (data: GalleryFormData) => {
    if (editingItem) {
      handleEditPhoto(data);
    } else {
      handleAddPhoto(data);
    }
  };

  const handleAddPhoto = async (data: GalleryFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/galeri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newItem = await res.json();
        setItems((prev) => [...prev, newItem].sort((a, b) => a.sira - b.sira));
        showToast("Görsel başarıyla galeriye eklendi", "success");
        setIsAddOpen(false);
        reset();
      } else {
        showToast("Görsel eklenemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu görseli galeriden kaldırmak istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/galeri?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        showToast("Görsel galeriden kaldırıldı", "success");
      } else {
        showToast("Görsel silinemedi", "error");
      }
    } catch (err) {
      showToast("Sunucu hatası oluştu", "error");
    }
  };

  const categoriesOptions = [
    { value: "Nail Art", label: "Nail Art" },
    { value: "Saç", label: "Saç" },
    { value: "Cilt Bakımı", label: "Cilt Bakımı" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button variant="primary" onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Yeni Görsel Ekle
        </Button>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} padding="none" className="group bg-white flex flex-col justify-between h-[420px]">
            {/* Thumbnail */}
            <div className="relative h-64 overflow-hidden bg-champagne/20">
              <img
                src={item.gorsel}
                alt={item.baslik}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-mauve shadow-sm">
                {item.kategori}
              </span>
            </div>

            {/* Content info */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-3 text-left">
              <div className="flex flex-col gap-1.5">
                <h4 className="font-display font-bold text-base text-obsidian line-clamp-1">
                  {item.baslik}
                </h4>
                <div className="flex items-center gap-2 text-[10px]">
                  <span>Sıra: <strong>{item.sira}</strong></span>
                  <span>•</span>
                  {item.one_cikan ? (
                    <Badge variant="primary" className="text-[8px]">Öne Çıkan</Badge>
                  ) : (
                    <span className="text-charcoal/40 font-light">Standart</span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-champagne/30 pt-3 flex items-center justify-end gap-3">
                <button
                  onClick={() => openEditModal(item)}
                  className="flex items-center gap-1.5 text-xs text-mauve hover:text-mauve/80 font-semibold cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Kaldır</span>
                </button>
              </div>
            </div>
          </Card>
        ))}

        {items.length === 0 && (
          <div className="col-span-3 text-center py-20 text-charcoal/50 flex flex-col items-center justify-center border border-dashed border-champagne rounded-sm min-h-[300px]">
            <ImageIcon className="w-8 h-8 mb-2 text-charcoal/30 animate-pulse" />
            <span>Galeride görsel bulunmamaktadır. Sağ üstten yeni görsel ekleyebilirsiniz.</span>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddOpen || !!editingItem}
        onClose={handleCloseModal}
        title={editingItem ? "Görseli Düzenle" : "Yeni Galeri Görseli Ekle"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 text-left">
          <Input
            label="Görsel Başlığı *"
            placeholder="Fotoğraf için bir başlık girin"
            error={errors.baslik?.message}
            {...register("baslik")}
          />

          <Select
            label="Kategori *"
            options={categoriesOptions}
            error={errors.kategori?.message}
            {...register("kategori")}
          />

          <div className="flex flex-col gap-1.5 text-xs text-charcoal">
            <span className="font-semibold text-charcoal/70 uppercase tracking-widest text-[10px]">Görsel Yükle *</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 border border-champagne p-3 bg-white rounded-sm">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="gallery-image-upload"
              />
              <label
                htmlFor="gallery-image-upload"
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sıralama Değeri (1-99) *"
              type="number"
              error={errors.sira?.message}
              {...register("sira", { valueAsNumber: true })}
            />
            {/* Custom Checkbox for Featured */}
            <div className="flex flex-col gap-1.5 justify-center pt-5">
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
                <span>Ana Sayfada Göster (Öne Çıkar)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end pt-4 border-t border-champagne/30 mt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
              İptal
            </Button>
            <Button type="submit" isLoading={isSubmitting} variant="primary">
              Kaydet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
