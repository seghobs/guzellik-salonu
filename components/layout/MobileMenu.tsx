"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavLink {
  name: string;
  path: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  member: { id: string; ad: string; email: string } | null;
  onAuthClick: () => void;
  onLogout: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navLinks,
  member,
  onAuthClick,
  onLogout,
}) => {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-30 md:hidden flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian/45 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="w-4/5 max-w-sm h-full bg-ivory text-charcoal shadow-2xl relative z-10 flex flex-col justify-between p-6 border-l border-champagne/40"
          >
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 mb-10 pb-4 border-b border-champagne/20">
                <Sparkles className="w-5 h-5 text-mauve" />
                <span className="font-display text-xl font-bold tracking-[0.12em] text-obsidian uppercase">
                  Luxe <span className="text-mauve font-light tracking-[0.12em]">Beauty</span>
                </span>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col gap-5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      href={link.path}
                      onClick={onClose}
                      className={`text-sm uppercase tracking-widest font-semibold py-2.5 transition-all ${
                        isActive ? "text-mauve font-bold pl-3 border-l-2 border-mauve" : "text-charcoal"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col gap-5">
              {member ? (
                <div className="flex flex-col gap-2.5 pt-4 border-t border-champagne/20">
                  <div className="text-center text-xs font-semibold text-charcoal/60 truncate font-body">
                    Hoş geldiniz, {member.ad}
                  </div>
                  <Link href="/profil" onClick={onClose} className="w-full">
                    <Button className="w-full font-body" variant="outline">
                      Profilim
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="w-full font-body"
                    variant="ghost"
                  >
                    <span className="text-rose-600 font-semibold uppercase tracking-wider text-xs">Çıkış Yap</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 pt-4 border-t border-champagne/20">
                  <Button
                    onClick={() => {
                      onClose();
                      onAuthClick();
                    }}
                    className="w-full font-body"
                    variant="outline"
                  >
                    Üye Girişi / Üye Ol
                  </Button>
                </div>
              )}

              <Link href="/randevu" onClick={onClose} className="w-full">
                <Button className="w-full" variant="primary">
                  Randevu Al
                </Button>
              </Link>

              {/* Contact mini-info */}
              <div className="flex flex-col gap-3 pt-6 border-t border-champagne/20 text-xs text-charcoal/70">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-mauve" />
                  <span>+90 212 555 00 00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-mauve" />
                  <span>info@luxebeauty.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-mauve shrink-0" />
                  <span>Nişantaşı, Şişli / İstanbul</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default MobileMenu;
