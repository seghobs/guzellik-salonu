"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, LogIn, UserPlus } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useToast } from "../ui/Toast";

interface MemberAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (member: { id: string; ad: string; email: string }) => void;
}

export const MemberAuthModal: React.FC<MemberAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", sifre: "" });
  const [registerForm, setRegisterForm] = useState({
    ad: "",
    telefon: "",
    email: "",
    sifre: "",
    dogum_tarihi: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.sifre) {
      showToast("Tüm alanları doldurunuz.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/uye/giris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.isAdmin) {
          showToast("Yönetici girişi başarılı! Yönetim paneline yönlendiriliyorsunuz.", "success");
          onClose();
          router.push("/panel");
          router.refresh();
        } else {
          showToast("Giriş başarılı! Hoş geldiniz.", "success");
          onSuccess(data.member);
          onClose();
          window.location.reload();
        }
      } else {
        showToast(data.message || "Giriş başarısız oldu.", "error");
      }
    } catch (err) {
      showToast("Bağlantı hatası oluştu.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ad, telefon, email, sifre } = registerForm;
    if (!ad || !telefon || !email || !sifre) {
      showToast("Yıldızlı (*) alanlar zorunludur.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/uye/kayit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "Kayıt başarılı! Şimdi giriş yapabilirsiniz.", "success");
        
        // Auto login after registration
        const loginRes = await fetch("/api/uye/giris", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, sifre }),
        });
        const loginData = await loginRes.json();
        
        if (loginRes.ok) {
          onSuccess(loginData.member);
          window.location.reload();
        } else {
          setActiveTab("login");
        }
        onClose();
      } else {
        showToast(data.message || "Kayıt başarısız oldu.", "error");
      }
    } catch (err) {
      showToast("Bağlantı hatası oluştu.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian/45 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-ivory text-charcoal border border-champagne/80 p-8 shadow-2xl rounded-sm z-10 flex flex-col gap-6"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-charcoal hover:text-mauve transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-2.5 bg-mauve/10 rounded-full text-mauve">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-display text-2xl font-bold text-obsidian tracking-wide uppercase">
                Luxe Beauty Üyelik
              </h3>
              <p className="text-xs text-charcoal/70">
                Ayrıcalıklı randevu takibi ve canlı destek deneyimi.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-champagne/40">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 pb-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "login"
                    ? "border-mauve text-mauve font-bold"
                    : "border-transparent text-charcoal/60 hover:text-mauve"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" /> Giriş Yap
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 pb-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "register"
                    ? "border-mauve text-mauve font-bold"
                    : "border-transparent text-charcoal/60 hover:text-mauve"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Üye Ol
              </button>
            </div>

            {/* Active Tab Panel */}
            <div className="flex-1">
              {activeTab === "login" ? (
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                  <Input
                    label="E-posta veya Kullanıcı Adı"
                    name="email"
                    type="text"
                    required
                    placeholder="ornek@email.com veya kullanıcı adı"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                  />
                  <Input
                    label="Şifre"
                    name="sifre"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginForm.sifre}
                    onChange={handleLoginChange}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full mt-2 py-3"
                    isLoading={isLoading}
                  >
                    Giriş Yap
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 max-h-[45vh] overflow-y-auto pr-1">
                  <Input
                    label="Ad Soyad *"
                    name="ad"
                    required
                    placeholder="Adınız Soyadınız"
                    value={registerForm.ad}
                    onChange={handleRegisterChange}
                  />
                  <Input
                    label="Telefon Numarası *"
                    name="telefon"
                    required
                    placeholder="+90 5xx xxx xx xx"
                    value={registerForm.telefon}
                    onChange={handleRegisterChange}
                  />
                  <Input
                    label="E-posta Adresi *"
                    name="email"
                    type="email"
                    required
                    placeholder="ornek@email.com"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                  />
                  <Input
                    label="Şifre *"
                    name="sifre"
                    type="password"
                    required
                    placeholder="Minimum 6 Karakter"
                    value={registerForm.sifre}
                    onChange={handleRegisterChange}
                  />
                  <Input
                    label="Doğum Tarihi"
                    name="dogum_tarihi"
                    type="date"
                    value={registerForm.dogum_tarihi}
                    onChange={handleRegisterChange}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full mt-2 py-3 shrink-0"
                    isLoading={isLoading}
                  >
                    Kayıt Ol & Giriş Yap
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default MemberAuthModal;
