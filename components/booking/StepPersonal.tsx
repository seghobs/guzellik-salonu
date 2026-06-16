"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/Input";

const personalSchema = z.object({
  ad: z.string().min(3, "Ad Soyad en az 3 karakter olmalıdır"),
  telefon: z.string().min(10, "Geçerli bir telefon numarası giriniz (örn: 05001112233)"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  dogum_tarihi: z.string().optional(),
  notlar: z.string().optional(),
});

export type PersonalFormData = z.infer<typeof personalSchema>;

interface StepPersonalProps {
  initialData: PersonalFormData | null;
  onSave: (data: PersonalFormData) => void;
  formId: string; // Used to trigger submit from parent wizard buttons
}

export const StepPersonal: React.FC<StepPersonalProps> = ({
  initialData,
  onSave,
  formId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: initialData || {
      ad: "",
      telefon: "",
      email: "",
      dogum_tarihi: "",
      notlar: "",
    },
  });

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSave)}
      className="flex flex-col gap-6 animate-fade-in text-left"
    >
      <div className="flex flex-col gap-1 border-b border-champagne/20 pb-4">
        <h3 className="font-display text-xl font-bold text-obsidian tracking-wide uppercase">
          Adım 4: Kişisel Bilgiler
        </h3>
        <p className="text-xs text-charcoal/60 font-light">
          Lütfen randevunuzu onaylamak için iletişim ve kişisel bilgilerinizi eksiksiz doldurunuz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Adınız Soyadınız *"
          placeholder="Adınız Soyadınız"
          error={errors.ad?.message}
          {...register("ad")}
        />
        <Input
          label="E-posta Adresiniz *"
          type="email"
          placeholder="ornek@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Telefon Numarası *"
          type="tel"
          placeholder="05xxxxxxxxx"
          error={errors.telefon?.message}
          {...register("telefon")}
        />
        <Input
          label="Doğum Tarihi (İsteğe Bağlı)"
          type="date"
          error={errors.dogum_tarihi?.message}
          {...register("dogum_tarihi")}
        />
      </div>

      <Input
        label="Randevu Notları (İsteğe Bağlı)"
        multiline
        placeholder="Eklemek istediğiniz özel bir not veya istek var mı?"
        error={errors.notlar?.message}
        rows={4}
        {...register("notlar")}
      />
    </form>
  );
};
export default StepPersonal;
