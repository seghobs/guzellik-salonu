import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { DbSchema } from "./jsonDb";

async function main() {
  const DB_PATH = path.join(process.cwd(), "data", "db.json");
  console.log("Seeding database to: ", DB_PATH);

  // Hash the admin password "luxe2025"
  const passwordHash = await bcrypt.hash("luxe2025", 10);

  const initialData: DbSchema = {
    salon: {
      id: "luxebeauty-001",
      ad: "LuxeBeauty Güzellik Salonu",
      slogan: "Güzelliğin En Rafine Hali",
      telefon: "+90 212 555 00 00",
      email: "info@luxebeauty.com",
      adres: "Nişantaşı Mah. Güzellik Cad. No:42, Şişli / İstanbul",
      calisma_saatleri: {
        pazartesi: { acik: true, baslangic: "09:00", bitis: "20:00" },
        sali:      { acik: true, baslangic: "09:00", bitis: "20:00" },
        carsamba:  { acik: true, baslangic: "09:00", bitis: "20:00" },
        persembe:  { acik: true, baslangic: "09:00", bitis: "20:00" },
        cuma:      { acik: true, baslangic: "09:00", bitis: "21:00" },
        cumartesi: { acik: true, baslangic: "10:00", bitis: "21:00" },
        pazar:     { acik: false, baslangic: null,   bitis: null }
      },
      sosyal_medya: {
        instagram: "https://instagram.com/luxebeauty",
        facebook:  "https://facebook.com/luxebeauty",
        tiktok:    "https://tiktok.com/@luxebeauty"
      }
    },
    hizmetler: [
      {
        id: "hizmet-001",
        slug: "klasik-manifaktur",
        ad: "Klasik Manikür",
        kategori: "El & Tırnak",
        sure_dk: 60,
        fiyat: 450,
        aciklama: "Tırnak şekillendirme, tırnak eti bakımı ve kalıcı oje uygulaması.",
        detayli_aciklama: "Uzun soluklu parlaklık ve zarif eller için profesyonel manikür bakımı. Tırnak törpüleme, şekillendirme, kütikül temizliği, el masajı ve yüksek kaliteli kalıcı oje uygulamasını içerir.",
        gorsel: "https://images.unsplash.com/photo-1604654894610-df490c939e05?auto=format&fit=crop&w=600&q=80",
        aktif: true,
        one_cikan: true,
        eklenme_tarihi: "2024-01-15T00:00:00.000Z"
      },
      {
        id: "hizmet-002",
        slug: "french-manikur",
        ad: "French Manikür",
        kategori: "El & Tırnak",
        sure_dk: 75,
        fiyat: 550,
        aciklama: "Zamansız zariflik için klasik fransız manikürü uygulaması.",
        detayli_aciklama: "Her kıyafetle ve her ortamda göz kamaştıran zamansız bir klasik. Özel beyaz şerit çekimi, tırnak uçlarının parlatılması ve tırnak etlerinin özenle temizlenmesi ile kusursuz görünüm.",
        gorsel: "https://images.unsplash.com/photo-1632345031435-8797b2d58045?auto=format&fit=crop&w=600&q=80",
        aktif: true,
        one_cikan: true,
        eklenme_tarihi: "2024-01-15T00:00:00.000Z"
      },
      {
        id: "hizmet-003",
        slug: "cilt-bakimi",
        ad: "Derin Cilt Bakımı",
        kategori: "Cilt Bakımı",
        sure_dk: 90,
        fiyat: 850,
        aciklama: "Leke giderici, gözenek temizleyici ve nemlendirici profesyonel cilt bakımı.",
        detayli_aciklama: "Cildinizin ihtiyacı olan tüm bileşenleri barındıran derin temizleme ve bakım seansı. Bitkisel peeling, buhar banyosu, siyah nokta temizliği, cilde uygun serum ve canlandırıcı maske ile pürüzsüz bir cilde kavuşun.",
        gorsel: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
        aktif: true,
        one_cikan: true,
        eklenme_tarihi: "2024-01-15T00:00:00.000Z"
      },
      {
        id: "hizmet-004",
        slug: "keratin-sac-bakimi",
        ad: "Keratin Saç Bakımı",
        kategori: "Saç",
        sure_dk: 120,
        fiyat: 1200,
        aciklama: "Kabarık ve yıpranmış saçlar için ipeksi düzlük ve derinlemesine onarım.",
        detayli_aciklama: "Yüksek kaliteli keratin formülü ile yıpranmış saç tellerini içeriden onarır, saçın elektriklenmesini ve kabarmasını önler. 3 aya kadar ipeksi bir düzlük, parlaklık ve kolay tarama sağlar.",
        gorsel: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
        aktif: true,
        one_cikan: false,
        eklenme_tarihi: "2024-01-15T00:00:00.000Z"
      }
    ],
    personel: [
      {
        id: "personel-001",
        slug: "ayse-yilmaz",
        ad: "Ayşe Yılmaz",
        unvan: "Baş Tırnak Uzmanı",
        bio: "10 yıllık deneyimiyle Ayşe, nail art alanında ülkemizdeki öncü isimlerden. Kusursuz çizimler ve modern desenler konusunda uzmandır.",
        uzmanlik_alanlari: ["El & Tırnak", "Nail Art", "Jel Oje"],
        gorsel: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        puan: 4.9,
        yorum_sayisi: 124,
        hizmet_verdigi_hizmetler: ["hizmet-001", "hizmet-002"],
        musait_gunler: ["pazartesi", "sali", "carsamba", "persembe", "cuma"],
        aktif: true
      },
      {
        id: "personel-002",
        slug: "fatma-kara",
        ad: "Fatma Kara",
        unvan: "Cilt Bakım Uzmanı",
        bio: "Dermokozmetik eğitimi almış, cilt analizi ve medikal cilt bakımı konusunda uzmanlaşmış profesyonel. Cildinizin en sağlıklı haline kavuşmasını sağlar.",
        uzmanlik_alanlari: ["Cilt Bakımı", "Makyaj", "Kaş Tasarımı"],
        gorsel: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        puan: 4.8,
        yorum_sayisi: 98,
        hizmet_verdigi_hizmetler: ["hizmet-003"],
        musait_gunler: ["sali", "carsamba", "persembe", "cuma", "cumartesi"],
        aktif: true
      },
      {
        id: "personel-003",
        slug: "meryem-demir",
        ad: "Meryem Demir",
        unvan: "Saç Stilisti",
        bio: "Paris'te eğitim almış, modern saç kesimleri ve trend balyaj/renklendirme teknikleriyle tanınan vizyoner stilistimiz.",
        uzmanlik_alanlari: ["Saç Kesim", "Balyaj", "Keratin", "Saç Tasarımı"],
        gorsel: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
        puan: 4.9,
        yorum_sayisi: 211,
        hizmet_verdigi_hizmetler: ["hizmet-004"],
        musait_gunler: ["pazartesi", "carsamba", "cuma", "cumartesi"],
        aktif: true
      }
    ],
    randevular: [
      {
        id: "randevu-001",
        musteri_id: "musteri-001",
        hizmet_id: "hizmet-001",
        personel_id: "personel-001",
        tarih: "2026-07-15",
        baslangic_saati: "10:00",
        bitis_saati: "11:00",
        durum: "onaylandi",
        notlar: "Kısa ve küt tırnak kesimi istiyor, nude renk tonları tercih edecek.",
        toplam_fiyat: 450,
        olusturma_tarihi: "2026-06-10T14:23:00.000Z",
        guncelleme_tarihi: "2026-06-10T14:23:00.000Z"
      }
    ],
    musteriler: [
      {
        id: "musteri-001",
        ad: "Selin Çetin",
        telefon: "+90 532 111 22 33",
        email: "selin@email.com",
        dogum_tarihi: "1992-03-14",
        ilk_ziyaret: "2025-03-01T00:00:00.000Z",
        son_ziyaret: "2026-06-10T00:00:00.000Z",
        toplam_ziyaret: 12,
        toplam_harcama: 6800,
        notlar: "Kalıcı oje markalarına hassasiyeti var, organik bazlı ürünler tercih ediyor.",
        tercihler: ["Kalıcı oje", "Kısa tırnak"],
        kayitli_uye: false
      }
    ],
    yorumlar: [
      {
        id: "yorum-001",
        randevu_id: "randevu-001",
        musteri_id: "musteri-001",
        puan: 5,
        yorum: "Harika bir deneyimdi! Ayşe Hanım çok ilgili ve titizdi, tırnaklarım tam istediğim gibi oldu.",
        tarih: "2026-06-11T10:00:00.000Z",
        onaylandi: true
      }
    ],
    galeri: [
      {
        id: "galeri-001",
        baslik: "Nail Art Bahar Koleksiyonu",
        kategori: "Nail Art",
        gorsel: "https://images.unsplash.com/photo-1604654894610-df490c939e05?auto=format&fit=crop&w=800&q=80",
        one_cikan: true,
        sira: 1,
        eklenme_tarihi: "2026-04-01T00:00:00.000Z"
      },
      {
        id: "galeri-002",
        baslik: "Sombre ve Balyaj Çalışması",
        kategori: "Saç",
        gorsel: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
        one_cikan: true,
        sira: 2,
        eklenme_tarihi: "2026-04-05T00:00:00.000Z"
      },
      {
        id: "galeri-003",
        baslik: "Medikal Cilt Bakım Seansı",
        kategori: "Cilt Bakımı",
        gorsel: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
        one_cikan: true,
        sira: 3,
        eklenme_tarihi: "2026-04-10T00:00:00.000Z"
      }
    ],
    admin: {
      kullanici_adi: "admin",
      sifre_hash: passwordHash,
      email: "admin@luxebeauty.com",
      son_giris: null
    },
    mesajlar: []
  };

  const dirPath = path.dirname(DB_PATH);
  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
  console.log("Database seeded successfully!");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
