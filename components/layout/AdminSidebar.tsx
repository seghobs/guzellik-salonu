"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Calendar,
  Sparkle,
  Users,
  UserCheck,
  Image as ImageIcon,
  MessageSquare,
  LogOut,
  Menu,
  X,
  UserCog,
} from "lucide-react";
import { useToast } from "../ui/Toast";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/panel", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Randevular", path: "/panel/randevular", icon: <Calendar className="w-4 h-4" /> },
    { name: "Hizmetler", path: "/panel/hizmetler", icon: <Sparkle className="w-4 h-4" /> },
    { name: "Personel", path: "/panel/personel", icon: <Users className="w-4 h-4" /> },
    { name: "Müşteriler", path: "/panel/musteriler", icon: <UserCheck className="w-4 h-4" /> },
    { name: "Üye Yetkileri", path: "/panel/yetkiler", icon: <UserCog className="w-4 h-4" /> },
    { name: "Mesajlar", path: "/panel/mesajlar", icon: <MessageSquare className="w-4 h-4" /> },
    { name: "Galeri Yönetimi", path: "/panel/galeri", icon: <ImageIcon className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Başarıyla çıkış yapıldı", "success");
        router.push("/login");
        router.refresh();
      } else {
        showToast("Çıkış yapılırken hata oluştu", "error");
      }
    } catch (err) {
      showToast("Çıkış yapılamadı", "error");
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-obsidian text-champagne/85 border border-mauve/20 rounded-sm shadow-md md:hidden hover:bg-mauve hover:text-white transition-all cursor-pointer flex items-center justify-center"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-obsidian/45 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar aside panel */}
      <aside className={`fixed inset-y-0 left-0 z-45 md:sticky md:top-0 w-64 bg-obsidian text-champagne/85 border-r border-mauve/20 flex flex-col justify-between shrink-0 h-screen transition-transform duration-300 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        {/* Upper Brand / Menu */}
        <div>
          {/* Brand */}
          <div className="flex items-center gap-2 p-6 border-b border-white/5">
            <Sparkles className="w-5 h-5 text-rose-dust" />
            <span className="font-display text-xl font-bold tracking-widest text-white uppercase">
              Luxe<span className="text-rose-dust font-light font-accent lowercase italic">admin</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="p-4 flex flex-col gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-mauve to-[#764E70] text-white shadow-[0_8px_20px_-4px_rgba(139,94,131,0.4)]"
                      : "hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Lower Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-rose-500/10 hover:text-rose-400 text-champagne/60 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>
    </>
  );
};
