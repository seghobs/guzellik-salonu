"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Lock, User } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../components/ui/Toast";

const loginSchema = z.object({
  kullanici_adi: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
  sifre: z.string().min(5, "Şifre en az 5 karakter olmalıdır"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (res.ok) {
        showToast("Giriş başarılı! Yönetim paneline yönlendiriliyorsunuz.", "success");
        router.push("/panel");
        router.refresh();
      } else {
        showToast(resData.message || "Giriş başarısız. Bilgilerinizi kontrol edin.", "error");
      }
    } catch (err) {
      showToast("Giriş yapılırken bir bağlantı hatası oluştu.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-obsidian min-h-screen flex items-center justify-center py-12 px-6 relative overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-mauve/10 blur-[120px]" />

      <div className="max-w-md w-full bg-white border border-champagne/40 p-8 shadow-2xl relative z-10 hover-gold-glow animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <div className="p-2.5 bg-mauve/10 rounded-full border border-mauve/20 text-mauve">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-obsidian tracking-widest uppercase">
              LuxeBeauty
            </h2>
            <span className="text-[10px] uppercase tracking-widest text-charcoal/50 font-semibold mt-0.5">
              Yönetim Paneli Giriş
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 text-left">
          <div className="relative">
            <Input
              label="Kullanıcı Adı"
              placeholder="Kullanıcı adınızı girin"
              error={errors.kullanici_adi?.message}
              {...register("kullanici_adi")}
            />
          </div>

          <div className="relative">
            <Input
              label="Şifre"
              type="password"
              placeholder="Şifrenizi girin"
              error={errors.sifre?.message}
              {...register("sifre")}
            />
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full mt-4 py-4 justify-center">
            Giriş Yap
          </Button>
        </form>
      </div>
    </div>
  );
}
