# 💅 LuxeBeauty — Güzellik Salonu Web Uygulaması

> Modern, şık ve tam özellikli bir güzellik salonu yönetim + müşteri portalı.  
> **Next.js  · App Router · JSON Veritabanı (lowdb) · Tailwind CSS · Framer Motion**

---

## 📐 Proje Vizyonu

LuxeBeauty, hem müşterilere (randevu al, hizmet keşfet, galeri gör) hem de salon sahiplerine (randevu yönet, personel ekle, istatistik görüntüle) hizmet eden tam kapsamlı bir web uygulamasıdır. Veritabanı olarak JSON dosyaları kullanılır — sıfır kurulum, maksimum taşınabilirlik.

---

## 🗂️ Proje Yapısı

```
luxebeauty/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx                # Root layout (font, metadata, providers)
│   ├── page.tsx                  # Ana sayfa (Landing)
│   ├── globals.css               # Global stiller
│   │
│   ├── (public)/                 # Müşteri tarafı sayfalar
│   │   ├── hizmetler/
│   │   │   ├── page.tsx          # Tüm hizmetler listesi
│   │   │   └── [slug]/page.tsx   # Hizmet detay sayfası
│   │   ├── randevu/
│   │   │   ├── page.tsx          # Randevu alma formu (çok adımlı)
│   │   │   └── basarili/page.tsx # Onay sayfası
│   │   ├── galeri/
│   │   │   └── page.tsx          # Fotoğraf galerisi (masonry grid)
│   │   ├── ekip/
│   │   │   └── page.tsx          # Uzman kadro tanıtım sayfası
│   │   ├── hakkimizda/
│   │   │   └── page.tsx          # Salon hikayesi & değerler
│   │   └── iletisim/
│   │       └── page.tsx          # İletişim formu & harita
│   │
│   ├── (admin)/                  # Salon yönetim paneli
│   │   ├── login/page.tsx        # Admin giriş
│   │   └── panel/
│   │       ├── layout.tsx        # Admin sidebar layout
│   │       ├── page.tsx          # Dashboard (istatistikler)
│   │       ├── randevular/
│   │       │   ├── page.tsx      # Randevu listesi & takvim
│   │       │   └── [id]/page.tsx # Randevu detay / düzenle
│   │       ├── hizmetler/
│   │       │   ├── page.tsx      # Hizmet listesi
│   │       │   └── yeni/page.tsx # Hizmet ekle / düzenle
│   │       ├── personel/
│   │       │   ├── page.tsx      # Personel listesi
│   │       │   └── yeni/page.tsx # Personel ekle
│   │       ├── musteriler/
│   │       │   └── page.tsx      # Müşteri veritabanı
│   │       └── galeri/
│   │           └── page.tsx      # Galeri yönetimi
│   │
│   └── api/                      # Next.js API Routes
│       ├── randevular/
│       │   ├── route.ts          # GET (liste) / POST (yeni randevu)
│       │   └── [id]/route.ts     # GET / PUT / DELETE
│       ├── hizmetler/
│       │   ├── route.ts
│       │   └── [slug]/route.ts
│       ├── personel/
│       │   └── route.ts
│       ├── musteri/
│       │   └── route.ts
│       ├── galeri/
│       │   └── route.ts
│       ├── musait-saatler/
│       │   └── route.ts          # Dolu/boş saat hesaplama
│       ├── iletisim/
│       │   └── route.ts          # İletişim formu maili
│       └── auth/
│           └── route.ts          # Admin login/logout
│
├── components/                   # Yeniden kullanılabilir bileşenler
│   ├── ui/                       # Temel UI bileşenleri
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Spinner.tsx
│   │   └── Toast.tsx
│   │
│   ├── layout/                   # Layout bileşenleri
│   │   ├── Navbar.tsx            # Üst navigasyon (şeffaf → solid scroll)
│   │   ├── Footer.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── MobileMenu.tsx
│   │
│   ├── home/                     # Ana sayfa bölümleri
│   │   ├── HeroSection.tsx       # Video/görsel hero + CTA
│   │   ├── ServicesPreview.tsx   # Öne çıkan 6 hizmet
│   │   ├── WhyUs.tsx             # Neden biz? (ikonlu kartlar)
│   │   ├── TeamPreview.tsx       # Uzman ekip önizleme
│   │   ├── GalleryPreview.tsx    # Masonry galeri önizleme
│   │   ├── TestimonialsSlider.tsx# Müşteri yorumları karusel
│   │   ├── StatsBar.tsx          # Rakamlarla biz (sayaç animasyon)
│   │   └── CTASection.tsx        # Son çağrı aksiyonu
│   │
│   ├── booking/                  # Randevu sistemi
│   │   ├── BookingWizard.tsx     # Çok adımlı form ana bileşen
│   │   ├── StepService.tsx       # Adım 1: Hizmet seç
│   │   ├── StepStaff.tsx         # Adım 2: Uzman seç
│   │   ├── StepDateTime.tsx      # Adım 3: Tarih & saat seç
│   │   ├── StepPersonal.tsx      # Adım 4: Kişisel bilgiler
│   │   ├── StepConfirm.tsx       # Adım 5: Özet & onay
│   │   ├── CalendarPicker.tsx    # Özel takvim bileşeni
│   │   └── TimeSlotGrid.tsx      # Saat dilimi grid
│   │
│   ├── admin/                    # Admin panel bileşenleri
│   │   ├── DashboardStats.tsx    # KPI kartları
│   │   ├── RevenueChart.tsx      # Gelir grafiği (Recharts)
│   │   ├── AppointmentTable.tsx  # Randevu tablosu
│   │   ├── AppointmentCalendar.tsx # Takvim görünümü
│   │   ├── StatusBadge.tsx       # Durum rozeti
│   │   └── QuickActions.tsx      # Hızlı işlem butonları
│   │
│   └── common/                   # Ortak bileşenler
│       ├── PageHero.tsx          # İç sayfa hero banner
│       ├── SectionTitle.tsx      # Bölüm başlığı
│       ├── ServiceCard.tsx       # Hizmet kartı
│       ├── StaffCard.tsx         # Personel kartı
│       ├── GalleryGrid.tsx       # Masonry galeri grid
│       ├── TestimonialCard.tsx   # Yorum kartı
│       └── ContactForm.tsx       # İletişim formu
│
├── lib/                          # Yardımcı fonksiyonlar & veritabanı
│   ├── db/
│   │   ├── index.ts              # lowdb bağlantısı & başlatma
│   │   ├── appointments.ts       # Randevu CRUD işlemleri
│   │   ├── services.ts           # Hizmet CRUD işlemleri
│   │   ├── staff.ts              # Personel CRUD işlemleri
│   │   ├── customers.ts          # Müşteri CRUD işlemleri
│   │   ├── gallery.ts            # Galeri CRUD işlemleri
│   │   └── seed.ts               # Demo veri yükleme scripti
│   │
│   ├── utils/
│   │   ├── dateUtils.ts          # Tarih formatlama & hesaplama
│   │   ├── timeSlots.ts          # Müsait saat algoritması
│   │   ├── validation.ts         # Form doğrulama şemaları (Zod)
│   │   ├── auth.ts               # JWT token işlemleri
│   │   └── emailTemplates.ts     # Mail şablonları
│   │
│   └── hooks/
│       ├── useAppointments.ts    # Randevu veri hook'u
│       ├── useServices.ts        # Hizmet veri hook'u
│       ├── useAuth.ts            # Auth durumu hook'u
│       └── useScrollAnimation.ts # Scroll animasyonu hook'u
│
├── data/                         # JSON Veritabanı (lowdb)
│   ├── db.json                   # Ana veritabanı dosyası
│   └── uploads/                  # Yüklenen görseller
│
├── public/
│   ├── images/
│   │   ├── hero/                 # Hero görselleri
│   │   ├── services/             # Hizmet görselleri
│   │   ├── gallery/              # Galeri fotoğrafları
│   │   ├── staff/                # Personel fotoğrafları
│   │   └── logo.svg
│   └── icons/
│
├── types/                        # TypeScript tip tanımları
│   ├── appointment.ts
│   ├── service.ts
│   ├── staff.ts
│   ├── customer.ts
│   └── gallery.ts
│
├── middleware.ts                 # Admin route koruması (JWT)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🗄️ Veritabanı Şeması (JSON)

Veritabanı `data/db.json` dosyasında tutulur ve **lowdb** ile yönetilir.

### `db.json` Tam Şema

```json
{
  "salon": {
    "id": "luxebeauty-001",
    "ad": "LuxeBeauty Güzellik Salonu",
    "slogan": "Güzelliğin En Rafine Hali",
    "telefon": "+90 212 555 00 00",
    "email": "info@luxebeauty.com",
    "adres": "Nişantaşı Mah. Güzellik Cad. No:42, Şişli / İstanbul",
    "calisma_saatleri": {
      "pazartesi": { "acik": true, "baslangic": "09:00", "bitis": "20:00" },
      "sali":      { "acik": true, "baslangic": "09:00", "bitis": "20:00" },
      "carsamba":  { "acik": true, "baslangic": "09:00", "bitis": "20:00" },
      "persembe":  { "acik": true, "baslangic": "09:00", "bitis": "20:00" },
      "cuma":      { "acik": true, "baslangic": "09:00", "bitis": "21:00" },
      "cumartesi": { "acik": true, "baslangic": "10:00", "bitis": "21:00" },
      "pazar":     { "acik": false, "baslangic": null,   "bitis": null }
    },
    "sosyal_medya": {
      "instagram": "https://instagram.com/luxebeauty",
      "facebook":  "https://facebook.com/luxebeauty",
      "tiktok":    "https://tiktok.com/@luxebeauty"
    }
  },

  "hizmetler": [
    {
      "id": "hizmet-001",
      "slug": "klasik-manifaktur",
      "ad": "Klasik Manifaktür",
      "kategori": "El & Tırnak",
      "sure_dk": 60,
      "fiyat": 450,
      "aciklama": "Tırnak şekillendirme, bakım ve kalıcı oje uygulaması.",
      "detayli_aciklama": "Uzun soluklu parlaklık için profesyonel manifaktür...",
      "gorsel": "/images/services/manifaktur.jpg",
      "aktif": true,
      "one_cikan": true,
      "eklenme_tarihi": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "hizmet-002",
      "slug": "french-manikur",
      "ad": "French Manikür",
      "kategori": "El & Tırnak",
      "sure_dk": 75,
      "fiyat": 550,
      "aciklama": "Zamansız zariflik için klasik fransız manikürü.",
      "detayli_aciklama": "...",
      "gorsel": "/images/services/french.jpg",
      "aktif": true,
      "one_cikan": true,
      "eklenme_tarihi": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "hizmet-003",
      "slug": "cilt-bakimi",
      "ad": "Derin Cilt Bakımı",
      "kategori": "Cilt Bakımı",
      "sure_dk": 90,
      "fiyat": 850,
      "aciklama": "Leke giderici ve nemlendirici profesyonel cilt bakımı.",
      "detayli_aciklama": "...",
      "gorsel": "/images/services/ciltbakimi.jpg",
      "aktif": true,
      "one_cikan": true,
      "eklenme_tarihi": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "hizmet-004",
      "slug": "keratin-sac-bakimi",
      "ad": "Keratin Saç Bakımı",
      "kategori": "Saç",
      "sure_dk": 120,
      "fiyat": 1200,
      "aciklama": "Frizz önleyici keratin ile ipeksi ve düz saçlar.",
      "detayli_aciklama": "...",
      "gorsel": "/images/services/keratin.jpg",
      "aktif": true,
      "one_cikan": false,
      "eklenme_tarihi": "2024-01-15T00:00:00.000Z"
    }
  ],

  "personel": [
    {
      "id": "personel-001",
      "slug": "ayse-yilmaz",
      "ad": "Ayşe Yılmaz",
      "unvan": "Baş Tırnak Uzmanı",
      "bio": "10 yıllık deneyimiyle Ayşe, nail art alanında ülkemizdeki öncü isimlerden.",
      "uzmanlık_alanlari": ["El & Tırnak", "Nail Art", "Jel Oje"],
      "gorsel": "/images/staff/ayse.jpg",
      "puan": 4.9,
      "yorum_sayisi": 124,
      "hizmet_verdigi_hizmetler": ["hizmet-001", "hizmet-002"],
      "musait_gunler": ["pazartesi", "sali", "carsamba", "persembe", "cuma"],
      "aktif": true
    },
    {
      "id": "personel-002",
      "slug": "fatma-kara",
      "ad": "Fatma Kara",
      "unvan": "Cilt Bakım Uzmanı",
      "bio": "Dermokozmetik eğitimi almış, cilt analizi konusunda uzmanlaşmış profesyonel.",
      "uzmanlık_alanlari": ["Cilt Bakımı", "Makyaj", "Kaş Tasarımı"],
      "gorsel": "/images/staff/fatma.jpg",
      "puan": 4.8,
      "yorum_sayisi": 98,
      "hizmet_verdigi_hizmetler": ["hizmet-003"],
      "musait_gunler": ["sali", "carsamba", "persembe", "cuma", "cumartesi"],
      "aktif": true
    },
    {
      "id": "personel-003",
      "slug": "meryem-demir",
      "ad": "Meryem Demir",
      "unvan": "Saç Stilisti",
      "bio": "Paris eğitimi almış, trend saç kesim ve boyama teknikleriyle tanınan stilist.",
      "uzmanlık_alanlari": ["Saç Kesim", "Balayage", "Keratin"],
      "gorsel": "/images/staff/meryem.jpg",
      "puan": 4.9,
      "yorum_sayisi": 211,
      "hizmet_verdigi_hizmetler": ["hizmet-004"],
      "musait_gunler": ["pazartesi", "carsamba", "cuma", "cumartesi"],
      "aktif": true
    }
  ],

  "randevular": [
    {
      "id": "randevu-001",
      "musteri_id": "musteri-001",
      "hizmet_id": "hizmet-001",
      "personel_id": "personel-001",
      "tarih": "2025-07-15",
      "baslangic_saati": "10:00",
      "bitis_saati": "11:00",
      "durum": "onaylandi",
      "notlar": "Kısa tırnak istiyor.",
      "toplam_fiyat": 450,
      "olusturma_tarihi": "2025-07-10T14:23:00.000Z",
      "guncelleme_tarihi": "2025-07-10T14:23:00.000Z"
    }
  ],

  "musteriler": [
    {
      "id": "musteri-001",
      "ad": "Selin Çetin",
      "telefon": "+90 532 111 22 33",
      "email": "selin@email.com",
      "dogum_tarihi": "1992-03-14",
      "ilk_ziyaret": "2024-03-01T00:00:00.000Z",
      "son_ziyaret": "2025-07-10T00:00:00.000Z",
      "toplam_ziyaret": 12,
      "toplam_harcama": 6800,
      "notlar": "Kırmızı tırnak alerjisi var.",
      "tercihler": ["Kalıcı oje", "Kısa tırnak"]
    }
  ],

  "yorumlar": [
    {
      "id": "yorum-001",
      "randevu_id": "randevu-001",
      "musteri_id": "musteri-001",
      "puan": 5,
      "yorum": "Harika bir deneyimdi! Ayşe Hanım çok ilgili ve titizdi.",
      "tarih": "2025-07-16T10:00:00.000Z",
      "onaylandi": true
    }
  ],

  "galeri": [
    {
      "id": "galeri-001",
      "baslik": "Bahar Koleksiyonu Nail Art",
      "kategori": "Nail Art",
      "gorsel": "/images/gallery/nail-art-1.jpg",
      "one_cikan": true,
      "sira": 1,
      "eklenme_tarihi": "2025-04-01T00:00:00.000Z"
    }
  ],

  "admin": {
    "kullanici_adi": "admin",
    "sifre_hash": "$2b$10$...",
    "email": "admin@luxebeauty.com",
    "son_giris": null
  }
}
```

---

## 🚀 Geliştirme Yol Haritası

### Faz 0 — Kurulum & Altyapı (Gün 1)
- [ ] `create-next-app` ile proje oluştur (TypeScript + App Router + Tailwind)
- [ ] Bağımlılıkları kur: `lowdb`, `framer-motion`, `react-hook-form`, `zod`, `recharts`, `date-fns`, `jsonwebtoken`, `bcryptjs`, `nodemailer`, `lucide-react`
- [ ] `data/db.json` oluştur ve seed scripti yaz
- [ ] Tailwind renk paletini ve tipografi sistemini ayarla
- [ ] `lib/db/index.ts` — lowdb bağlantısı kur

### Faz 1 — Temel Sayfa Yapısı (Gün 2-3)
- [ ] Root layout, Navbar (scroll efektli), Footer
- [ ] **Ana Sayfa** tüm bölümleriyle (Hero, Hizmetler, Ekip, Galeri, Yorumlar, CTA)
- [ ] **Hizmetler** listesi ve detay sayfaları
- [ ] **Ekip** tanıtım sayfası
- [ ] **Galeri** masonry grid sayfası
- [ ] **Hakkımızda** & **İletişim** sayfaları

### Faz 2 — API Katmanı (Gün 4)
- [ ] Tüm model için REST API rotaları (CRUD)
- [ ] Müsait saat hesaplama algoritması
- [ ] İletişim formu mail entegrasyonu
- [ ] Girdi doğrulama (Zod şemaları)

### Faz 3 — Randevu Sistemi (Gün 5-6)
- [ ] Çok adımlı randevu formu (`BookingWizard`)
- [ ] Özel takvim bileşeni (`CalendarPicker`)
- [ ] Müsait saat grid (`TimeSlotGrid`)
- [ ] Randevu onay sayfası
- [ ] Onay e-postası (Nodemailer)

### Faz 4 — Admin Paneli (Gün 7-8)
- [ ] JWT tabanlı admin girişi
- [ ] Middleware ile route koruması
- [ ] Dashboard istatistikleri + gelir grafiği
- [ ] Randevu listesi (tablo + takvim görünümü)
- [ ] Hizmet / Personel CRUD formları
- [ ] Müşteri veritabanı
- [ ] Galeri yönetimi (görsel yükleme)

### Faz 5 — Animasyon & Cila (Gün 9)
- [ ] Framer Motion sayfa geçişleri
- [ ] Scroll tetikli animasyonlar
- [ ] Sayaç animasyonları (StatsBar)
- [ ] Hover micro-interaction'lar
- [ ] Tam responsive (mobile-first)
- [ ] `prefers-reduced-motion` desteği

### Faz 6 — Test & Deploy (Gün 10)
- [ ] `db.json`'ı gerçekçi demo veriyle doldur
- [ ] Lighthouse performans testi
- [ ] Vercel'e deploy
- [ ] `data/` klasörünü persistent volume'a bağla

---

## 🛠️ Kullanılan Teknolojiler

| Katman | Teknoloji | Amaç |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR + API Routes tek çatı |
| Veritabanı | lowdb 7 (JSON) | Sıfır kurulum, dosya tabanlı DB |
| Stil | Tailwind CSS v3 | Utility-first hızlı stil |
| Animasyon | Framer Motion | Sayfa geçişleri & scroll efektleri |
| Form | React Hook Form + Zod | Tip güvenli form doğrulama |
| Grafik | Recharts | Admin gelir grafikleri |
| Tarih | date-fns | Tarih formatlama & hesaplama |
| Auth | jsonwebtoken + bcryptjs | Admin JWT kimlik doğrulama |
| Mail | Nodemailer | Randevu onay e-postası |
| İkon | Lucide React | Tutarlı SVG ikon seti |
| Upload | Next.js API + fs | Görsel yükleme |

---

## 🎨 Tasarım Sistemi

### Renk Paleti
```
--color-obsidian:  #1A1118  (arka plan - derin mor-siyah)
--color-mauve:     #8B5E83  (ana vurgu - lüks mor)
--color-rose-dust: #C9A7AB  (ikincil vurgu - gül tozu)
--color-champagne: #F5ECD7  (açık ton - krem)
--color-ivory:     #FDFAF5  (sayfa arka planı)
--color-charcoal:  #2D2A2E  (koyu metin)
```

### Tipografi
```
Display : "Cormorant Garamond" — serif, lüks hissi
Body    : "DM Sans" — geometrik sans-serif, okunabilirlik
Accent  : "Italiana" — italik başlıklar için
```

### Tasarım Prensibi
Minimalist lüks: Bol beyaz alan, ince border'lar, yumuşak gölgeler. Hero'da **büyük serif tipografi + krem arka plan + tek mauve vurgu**. Tüm kartlar hafif cam efekti (glassmorphism).

---

## 🔧 Hızlı Başlangıç

```bash
# Projeyi oluştur
npx create-next-app@latest luxebeauty --typescript --tailwind --app

cd luxebeauty

# Bağımlılıkları kur
npm install lowdb framer-motion react-hook-form @hookform/resolvers zod \
  recharts date-fns jsonwebtoken bcryptjs nodemailer lucide-react \
  @types/jsonwebtoken @types/bcryptjs @types/nodemailer

# Demo veriyi yükle
npx tsx lib/db/seed.ts

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama `http://localhost:3000` adresinde açılır.  
Admin paneli: `http://localhost:3000/panel` → kullanıcı: `admin` / şifre: `luxe2025`

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
