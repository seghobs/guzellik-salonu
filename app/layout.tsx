import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { ToastProvider } from "../components/ui/Toast";
import { ScrollbarTracker } from "../components/ui/ScrollbarTracker";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "LuxeBeauty | Güzellik Salonu ve Randevu Portalı",
  description: "Güzelliğin en rafine hali. Lüks hizmetler, uzman kadro ve zahmetsiz randevu alma deneyimi.",
  keywords: "güzellik salonu, randevu, manikür, pedikür, cilt bakımı, saç tasarımı, nail art, istanbul güzellik salonu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${playfair.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-charcoal font-body">
        <ScrollbarTracker />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
