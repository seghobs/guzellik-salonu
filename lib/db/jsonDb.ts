import fs from "fs/promises";
import path from "path";

// Define TypeScript types based on DB schema
export interface Salon {
  id: string;
  ad: string;
  slogan: string;
  telefon: string;
  email: string;
  adres: string;
  calisma_saatleri: {
    [key: string]: {
      acik: boolean;
      baslangic: string | null;
      bitis: string | null;
    };
  };
  sosyal_medya: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
}

export interface Hizmet {
  id: string;
  slug: string;
  ad: string;
  kategori: string;
  sure_dk: number;
  fiyat: number;
  aciklama: string;
  detayli_aciklama: string;
  gorsel: string;
  aktif: boolean;
  one_cikan: boolean;
  eklenme_tarihi: string;
}

export interface Personel {
  id: string;
  slug: string;
  ad: string;
  unvan: string;
  bio: string;
  uzmanlik_alanlari: string[];
  gorsel: string;
  puan: number;
  yorum_sayisi: number;
  hizmet_verdigi_hizmetler: string[];
  musait_gunler: string[];
  aktif: boolean;
}

export interface Randevu {
  id: string;
  musteri_id: string;
  hizmet_id: string;
  personel_id: string;
  tarih: string;
  baslangic_saati: string;
  bitis_saati: string;
  durum: "beklemede" | "onaylandi" | "reddedildi" | "tamamlandi" | "iptal";
  notlar: string;
  toplam_fiyat: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

export interface Musteri {
  id: string;
  ad: string;
  telefon: string;
  email: string;
  dogum_tarihi?: string;
  ilk_ziyaret: string;
  son_ziyaret: string;
  toplam_ziyaret: number;
  toplam_harcama: number;
  notlar?: string;
  tercihler?: string[];
  sifre_hash?: string;
  kayitli_uye: boolean;
  uye_olma_tarihi?: string;
  rol?: "admin" | "uye";
}

export interface Mesaj {
  id: string;
  uye_id: string;
  gonderici: "uye" | "admin";
  mesaj: string;
  tarih: string;
  okundu: boolean;
}

export interface Yorum {
  id: string;
  randevu_id: string;
  musteri_id: string;
  puan: number;
  yorum: string;
  tarih: string;
  onaylandi: boolean;
}

export interface GaleriItem {
  id: string;
  baslik: string;
  kategori: string;
  gorsel: string;
  one_cikan: boolean;
  sira: number;
  eklenme_tarihi: string;
}

export interface AdminUser {
  kullanici_adi: string;
  sifre_hash: string;
  email: string;
  son_giris: string | null;
}

export interface DbSchema {
  salon: Salon;
  hizmetler: Hizmet[];
  personel: Personel[];
  randevular: Randevu[];
  musteriler: Musteri[];
  yorumlar: Yorum[];
  galeri: GaleriItem[];
  admin: AdminUser;
  mesajlar: Mesaj[];
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

// In-memory cache to prevent constant disk reads
let dbCache: DbSchema | null = null;

export async function readDb(): Promise<DbSchema> {
  try {
    const fileContent = await fs.readFile(DB_PATH, "utf-8");
    dbCache = JSON.parse(fileContent);
    return dbCache!;
  } catch (error) {
    // If db doesn't exist, return empty or seed-ready structure
    console.error("Database read failed, falling back or initializing: ", error);
    throw new Error("Veritabanı okunamadı. Tohumlama gerekebilir.");
  }
}

export async function writeDb(data: DbSchema): Promise<void> {
  dbCache = data;
  const dirPath = path.dirname(DB_PATH);
  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// Quick helper to generate simple unique IDs
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}
