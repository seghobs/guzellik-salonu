import React from "react";
import { AdminSidebar } from "../../../components/layout/AdminSidebar";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-ivory">
      {/* Sidebar on the Left */}
      <AdminSidebar />

      {/* Main Panel Content on the Right */}
      <main className="flex-1 overflow-y-auto px-4 md:px-10 py-20 md:py-8 text-left">
        {children}
      </main>
    </div>
  );
}
