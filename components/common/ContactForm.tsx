"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Send } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useToast } from "../ui/Toast";

const contactSchema = z.object({
  adSoyad: z.string().min(3, "Ad Soyad en az 3 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  telefon: z.string().min(10, "Geçerli bir telefon numarası giriniz (örn: 05001112233)"),
  konu: z.string().min(4, "Konu en az 4 karakter olmalıdır"),
  mesaj: z.string().min(10, "Mesaj en az 10 karakter olmalıdır"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showToast("Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağız.", "success");
        reset();
      } else {
        const errData = await response.json();
        showToast(errData.message || "Mesajınız gönderilemedi. Lütfen tekrar deneyiniz.", "error");
      }
    } catch (err) {
      showToast("Bir bağlantı hatası oluştu.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-champagne/60 p-8 flex flex-col gap-6 hover-gold-glow animate-fade-in-up"
    >
      <div className="flex flex-col gap-1 mb-2">
        <h3 className="font-display text-2xl font-bold text-obsidian tracking-wide uppercase">
          Bize Ulaşın
        </h3>
        <p className="text-xs text-charcoal/60 font-light">
          Sorularınız, işbirlikleri veya önerileriniz için formu doldurun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Ad Soyad"
          placeholder="Adınız Soyadınız"
          error={errors.adSoyad?.message}
          {...register("adSoyad")}
        />
        <Input
          label="E-posta"
          type="email"
          placeholder="ornek@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Telefon"
          type="tel"
          placeholder="05xxxxxxxxx"
          error={errors.telefon?.message}
          {...register("telefon")}
        />
        <Input
          label="Konu"
          placeholder="Mesajınızın Konusu"
          error={errors.konu?.message}
          {...register("konu")}
        />
      </div>

      <Input
        label="Mesajınız"
        multiline
        placeholder="Mesajınızı buraya yazınız..."
        error={errors.mesaj?.message}
        rows={5}
        {...register("mesaj")}
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full mt-2 group justify-center">
        <Send className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
        Gönder
      </Button>
    </form>
  );
};
