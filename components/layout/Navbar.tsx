"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { MemberAuthModal } from "@/components/common/MemberAuthModal";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [member, setMember] = useState<{ id: string; ad: string; email: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/uye/profil");
        if (res.ok) {
          const data = await res.json();
          setMember(data.member);
        } else {
          setMember(null);
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    };
    checkSession();
  }, [pathname]);

  useEffect(() => {
    const handleOpenAuth = () => {
      setIsAuthModalOpen(true);
    };
    window.addEventListener("open-member-auth", handleOpenAuth);
    return () => window.removeEventListener("open-member-auth", handleOpenAuth);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/uye/cikis", { method: "DELETE" });
      if (res.ok) {
        setMember(null);
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { name: "Ana Sayfa", path: "/" },
    { name: "Hizmetler", path: "/hizmetler" },
    { name: "Uzmanlarımız", path: "/ekip" },
    { name: "Galeri", path: "/galeri" },
    { name: "Hakkımızda", path: "/hakkimizda" },
    { name: "İletişim", path: "/iletisim" },
  ];

  const isAdminPanel = pathname?.startsWith("/panel") || pathname?.startsWith("/login");

  if (isAdminPanel) return null; // Admin pages have their own layout

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "glass-effect py-3.5 shadow-[0_4px_20px_rgba(26,17,24,0.04)] border-b border-champagne/40"
            : "glass-effect py-4.5 border-b border-champagne/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-mauve/10 rounded-full group-hover:bg-mauve/20 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-mauve" />
            </div>
            <span className="font-display text-2xl font-bold tracking-[0.12em] text-obsidian uppercase">
              Luxe <span className="text-mauve font-light tracking-[0.12em]">Beauty</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-body">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`text-[13px] uppercase tracking-widest font-medium transition-all duration-300 relative py-1 hover:text-mauve ${
                    isActive ? "text-mauve font-bold" : "text-charcoal"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-mauve" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA, Member Auth & Mobile Toggle */}
          <div className="flex items-center gap-5">
            {/* Member Profile/Login */}
            <div className="hidden md:block">
              {member ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-xs uppercase tracking-widest font-bold text-charcoal hover:text-mauve flex items-center gap-1.5 transition-all cursor-pointer py-1.5"
                  >
                    <span>{member.ad.split(" ")[0]}</span>
                    <span className="text-[9px] text-mauve">▼</span>
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2.5 w-48 bg-white border border-champagne shadow-xl rounded-sm py-2 z-50 text-left font-body"
                      >
                        <div className="px-4 py-1.5 border-b border-champagne/20 text-[11px] text-charcoal/50 font-medium truncate">
                          {member.email}
                        </div>
                        <Link
                          href="/profil"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-charcoal hover:bg-champagne/10 transition-all font-semibold uppercase tracking-wider"
                        >
                          Profilim
                        </Link>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-all font-semibold uppercase tracking-wider cursor-pointer"
                        >
                          Çıkış Yap
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-xs uppercase tracking-widest font-bold text-mauve hover:text-obsidian transition-all cursor-pointer py-1.5"
                >
                  Üye Girişi
                </button>
              )}
            </div>

            <Link href="/randevu" className="hidden md:block">
              <Button size="sm" variant="primary">
                Randevu Al
              </Button>
            </Link>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-1.5 md:hidden text-charcoal hover:text-mauve transition-all cursor-pointer"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Slideout */}
      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        navLinks={navLinks}
        member={member}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <MemberAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(m) => setMember(m)}
      />
    </>
  );
};
export default Navbar;
