import {
  readDb,
  writeDb,
  generateId,
  Salon,
  Hizmet,
  Personel,
  Randevu,
  Musteri,
  Yorum,
  GaleriItem,
  AdminUser,
  Mesaj,
} from "./jsonDb";

// Salon
export async function getSalon(): Promise<Salon> {
  const db = await readDb();
  return db.salon;
}

export async function updateSalon(data: Partial<Salon>): Promise<Salon> {
  const db = await readDb();
  db.salon = { ...db.salon, ...data };
  await writeDb(db);
  return db.salon;
}

// Hizmetler
export async function getHizmetler(activeOnly = false): Promise<Hizmet[]> {
  const db = await readDb();
  let services = db.hizmetler;
  if (activeOnly) {
    services = services.filter((s) => s.aktif);
  }
  return services.sort((a, b) => b.one_cikan ? 1 : 0 - (a.one_cikan ? 1 : 0));
}

export async function getHizmetBySlug(slug: string): Promise<Hizmet | undefined> {
  const db = await readDb();
  return db.hizmetler.find((s) => s.slug === slug);
}

export async function getHizmetById(id: string): Promise<Hizmet | undefined> {
  const db = await readDb();
  return db.hizmetler.find((s) => s.id === id);
}

export async function addHizmet(data: Omit<Hizmet, "id" | "eklenme_tarihi" | "slug">): Promise<Hizmet> {
  const db = await readDb();
  const slug = data.ad
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  
  const newHizmet: Hizmet = {
    ...data,
    id: generateId("hizmet"),
    slug,
    eklenme_tarihi: new Date().toISOString(),
  };
  db.hizmetler.push(newHizmet);
  await writeDb(db);
  return newHizmet;
}

export async function updateHizmet(id: string, data: Partial<Hizmet>): Promise<Hizmet> {
  const db = await readDb();
  const index = db.hizmetler.findIndex((s) => s.id === id);
  if (index === -1) throw new Error("Hizmet bulunamadı");
  
  if (data.ad) {
    data.slug = data.ad
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  db.hizmetler[index] = { ...db.hizmetler[index], ...data };
  await writeDb(db);
  return db.hizmetler[index];
}

export async function deleteHizmet(id: string): Promise<void> {
  const db = await readDb();
  db.hizmetler = db.hizmetler.filter((s) => s.id !== id);
  await writeDb(db);
}

// Personel
export async function getPersonel(activeOnly = false): Promise<Personel[]> {
  const db = await readDb();
  if (activeOnly) {
    return db.personel.filter((p) => p.aktif);
  }
  return db.personel;
}

export async function getPersonelBySlug(slug: string): Promise<Personel | undefined> {
  const db = await readDb();
  return db.personel.find((p) => p.slug === slug);
}

export async function getPersonelById(id: string): Promise<Personel | undefined> {
  const db = await readDb();
  return db.personel.find((p) => p.id === id);
}

export async function addPersonel(data: Omit<Personel, "id" | "puan" | "yorum_sayisi" | "slug">): Promise<Personel> {
  const db = await readDb();
  const slug = data.ad
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const newPersonel: Personel = {
    ...data,
    id: generateId("personel"),
    slug,
    puan: 5.0,
    yorum_sayisi: 0,
  };
  db.personel.push(newPersonel);
  await writeDb(db);
  return newPersonel;
}

export async function updatePersonel(id: string, data: Partial<Personel>): Promise<Personel> {
  const db = await readDb();
  const index = db.personel.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Personel bulunamadı");

  if (data.ad) {
    data.slug = data.ad
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  db.personel[index] = { ...db.personel[index], ...data };
  await writeDb(db);
  return db.personel[index];
}

export async function deletePersonel(id: string): Promise<void> {
  const db = await readDb();
  db.personel = db.personel.filter((p) => p.id !== id);
  await writeDb(db);
}

// Randevular
export async function getRandevular(): Promise<Randevu[]> {
  const db = await readDb();
  return db.randevular.sort((a, b) => new Date(b.tarih + "T" + b.baslangic_saati).getTime() - new Date(a.tarih + "T" + a.baslangic_saati).getTime());
}

export async function getRandevuById(id: string): Promise<Randevu | undefined> {
  const db = await readDb();
  return db.randevular.find((r) => r.id === id);
}

export async function addRandevu(data: Omit<Randevu, "id" | "olusturma_tarihi" | "guncelleme_tarihi">): Promise<Randevu> {
  const db = await readDb();
  const now = new Date().toISOString();
  const newRandevu: Randevu = {
    ...data,
    id: generateId("randevu"),
    olusturma_tarihi: now,
    guncelleme_tarihi: now,
  };
  db.randevular.push(newRandevu);

  // Update customer visitation and spending stats if they exist
  const custIndex = db.musteriler.findIndex((c) => c.id === data.musteri_id);
  if (custIndex !== -1) {
    db.musteriler[custIndex].son_ziyaret = now;
    db.musteriler[custIndex].toplam_ziyaret += 1;
    db.musteriler[custIndex].toplam_harcama += data.toplam_fiyat;
  }

  await writeDb(db);
  return newRandevu;
}

export async function updateRandevu(id: string, data: Partial<Randevu>): Promise<Randevu> {
  const db = await readDb();
  const index = db.randevular.findIndex((r) => r.id === id);
  if (index === -1) throw new Error("Randevu bulunamadı");

  db.randevular[index] = {
    ...db.randevular[index],
    ...data,
    guncelleme_tarihi: new Date().toISOString(),
  };

  // If status is changed to cancelled/rejected, adjust customer spending/visits if needed
  // Keep it simple for demo db
  await writeDb(db);
  return db.randevular[index];
}

export async function deleteRandevu(id: string): Promise<void> {
  const db = await readDb();
  db.randevular = db.randevular.filter((r) => r.id !== id);
  await writeDb(db);
}

// Musteriler
export async function getMusteriler(): Promise<Musteri[]> {
  const db = await readDb();
  return db.musteriler;
}

export async function getMusteriById(id: string): Promise<Musteri | undefined> {
  const db = await readDb();
  return db.musteriler.find((m) => m.id === id);
}

export async function getOrCreateMusteri(
  data: Omit<Musteri, "id" | "ilk_ziyaret" | "son_ziyaret" | "toplam_ziyaret" | "toplam_harcama">
): Promise<Musteri> {
  const db = await readDb();
  let musteri = db.musteriler.find(
    (m) => m.email.toLowerCase() === data.email.toLowerCase() || m.telefon === data.telefon
  );

  if (!musteri) {
    const now = new Date().toISOString();
    musteri = {
      ...data,
      id: generateId("musteri"),
      ilk_ziyaret: now,
      son_ziyaret: now,
      toplam_ziyaret: 0,
      toplam_harcama: 0,
    };
    db.musteriler.push(musteri);
    await writeDb(db);
  }
  return musteri;
}

export async function updateMusteri(id: string, data: Partial<Musteri>): Promise<Musteri> {
  const db = await readDb();
  const index = db.musteriler.findIndex((m) => m.id === id);
  if (index === -1) throw new Error("Müşteri bulunamadı");

  db.musteriler[index] = { ...db.musteriler[index], ...data };
  await writeDb(db);
  return db.musteriler[index];
}

export async function deleteMusteri(id: string): Promise<void> {
  const db = await readDb();
  db.musteriler = db.musteriler.filter((m) => m.id !== id);
  await writeDb(db);
}

// Yorumlar
export async function getYorumlar(approvedOnly = true): Promise<Yorum[]> {
  const db = await readDb();
  let comments = db.yorumlar;
  if (approvedOnly) {
    comments = comments.filter((c) => c.onaylandi);
  }
  return comments.sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime());
}

export async function addYorum(data: Omit<Yorum, "id" | "tarih" | "onaylandi">): Promise<Yorum> {
  const db = await readDb();
  const newYorum: Yorum = {
    ...data,
    id: generateId("yorum"),
    tarih: new Date().toISOString(),
    onaylandi: false, // Wait for admin approval
  };
  db.yorumlar.push(newYorum);
  await writeDb(db);
  return newYorum;
}

export async function updateYorum(id: string, data: Partial<Yorum>): Promise<Yorum> {
  const db = await readDb();
  const index = db.yorumlar.findIndex((y) => y.id === id);
  if (index === -1) throw new Error("Yorum bulunamadı");

  db.yorumlar[index] = { ...db.yorumlar[index], ...data };

  // Recalculate staff average score if comments are approved
  if (data.onaylandi && db.yorumlar[index].randevu_id) {
    const randevu = db.randevular.find((r) => r.id === db.yorumlar[index].randevu_id);
    if (randevu) {
      const staffId = randevu.personel_id;
      // Get all approved comments for this staff's appointments
      const staffAppointments = db.randevular.filter((r) => r.personel_id === staffId).map((r) => r.id);
      const staffComments = db.yorumlar.filter((y) => y.onaylandi && staffAppointments.includes(y.randevu_id));
      
      const averageRating = staffComments.reduce((acc, curr) => acc + curr.puan, 0) / (staffComments.length || 1);
      
      const staffIndex = db.personel.findIndex((p) => p.id === staffId);
      if (staffIndex !== -1) {
        db.personel[staffIndex].puan = parseFloat(averageRating.toFixed(1));
        db.personel[staffIndex].yorum_sayisi = staffComments.length;
      }
    }
  }

  await writeDb(db);
  return db.yorumlar[index];
}

export async function deleteYorum(id: string): Promise<void> {
  const db = await readDb();
  db.yorumlar = db.yorumlar.filter((y) => y.id !== id);
  await writeDb(db);
}

// Galeri
export async function getGaleri(featuredOnly = false): Promise<GaleriItem[]> {
  const db = await readDb();
  let items = db.galeri;
  if (featuredOnly) {
    items = items.filter((i) => i.one_cikan);
  }
  return items.sort((a, b) => a.sira - b.sira);
}

export async function addGaleriItem(data: Omit<GaleriItem, "id" | "eklenme_tarihi">): Promise<GaleriItem> {
  const db = await readDb();
  const newItem: GaleriItem = {
    ...data,
    id: generateId("galeri"),
    eklenme_tarihi: new Date().toISOString(),
  };
  db.galeri.push(newItem);
  await writeDb(db);
  return newItem;
}

export async function deleteGaleriItem(id: string): Promise<void> {
  const db = await readDb();
  db.galeri = db.galeri.filter((i) => i.id !== id);
  await writeDb(db);
}

export async function updateGaleriItem(id: string, data: Partial<GaleriItem>): Promise<GaleriItem> {
  const db = await readDb();
  const index = db.galeri.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Galeri ögesi bulunamadı");
  db.galeri[index] = { ...db.galeri[index], ...data };
  await writeDb(db);
  return db.galeri[index];
}

// Admin
export async function getAdmin(): Promise<AdminUser> {
  const db = await readDb();
  return db.admin;
}

export async function updateAdmin(data: Partial<AdminUser>): Promise<AdminUser> {
  const db = await readDb();
  db.admin = { ...db.admin, ...data };
  await writeDb(db);
  return db.admin;
}

// Üye & Sohbet İşlemleri
export async function getUyeByEmail(email: string): Promise<Musteri | undefined> {
  const db = await readDb();
  return db.musteriler.find((m) => m.email.toLowerCase() === email.toLowerCase());
}

export async function getUyeById(id: string): Promise<Musteri | undefined> {
  const db = await readDb();
  return db.musteriler.find((m) => m.id === id);
}

export async function addUye(data: Omit<Musteri, "id" | "ilk_ziyaret" | "son_ziyaret" | "toplam_ziyaret" | "toplam_harcama">): Promise<Musteri> {
  const db = await readDb();
  const now = new Date().toISOString();
  const newUye: Musteri = {
    ...data,
    id: generateId("musteri"),
    ilk_ziyaret: now,
    son_ziyaret: now,
    toplam_ziyaret: 0,
    toplam_harcama: 0,
    uye_olma_tarihi: now,
  };
  db.musteriler.push(newUye);
  await writeDb(db);
  return newUye;
}

export async function getMesajlarByUyeId(uyeId: string): Promise<Mesaj[]> {
  const db = await readDb();
  if (!db.mesajlar) db.mesajlar = [];
  return db.mesajlar
    .filter((m) => m.uye_id === uyeId)
    .sort((a, b) => new Date(a.tarih).getTime() - new Date(b.tarih).getTime());
}

export async function addMesaj(data: Omit<Mesaj, "id" | "tarih" | "okundu">): Promise<Mesaj> {
  const db = await readDb();
  if (!db.mesajlar) db.mesajlar = [];
  const newMesaj: Mesaj = {
    ...data,
    id: generateId("mesaj"),
    tarih: new Date().toISOString(),
    okundu: false,
  };
  db.mesajlar.push(newMesaj);
  await writeDb(db);
  return newMesaj;
}

export async function markMesajlarAsRead(uyeId: string, okuyan: "uye" | "admin"): Promise<void> {
  const db = await readDb();
  if (!db.mesajlar) db.mesajlar = [];
  
  // Eğer üye okuyorsa, admin'in gönderdiği mesajları okundu işaretler.
  // Eğer admin okuyorsa, üyenin gönderdiği mesajları okundu işaretler.
  const hedefGonderici = okuyan === "uye" ? "admin" : "uye";
  
  let degisti = false;
  db.mesajlar.forEach((m) => {
    if (m.uye_id === uyeId && m.gonderici === hedefGonderici && !m.okundu) {
      m.okundu = true;
      degisti = true;
    }
  });
  
  if (degisti) {
    await writeDb(db);
  }
}

export interface SohbetOdasi {
  uye: Musteri;
  sonMesaj?: Mesaj;
  okunmamisSayisi: number;
}

export async function getSohbetOdalari(): Promise<SohbetOdasi[]> {
  const db = await readDb();
  if (!db.mesajlar) db.mesajlar = [];
  
  // Sadece mesajı olan üyeleri listele
  const mesajliUyeIdleri = Array.from(new Set(db.mesajlar.map((m) => m.uye_id)));
  
  const odalar: SohbetOdasi[] = [];
  
  for (const uyeId of mesajliUyeIdleri) {
    const uye = db.musteriler.find((m) => m.id === uyeId);
    if (!uye) continue;
    
    const uyeMesajlari = db.mesajlar.filter((m) => m.uye_id === uyeId);
    const sonMesaj = uyeMesajlari.sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())[0];
    const okunmamisSayisi = uyeMesajlari.filter((m) => m.gonderici === "uye" && !m.okundu).length;
    
    odalar.push({
      uye,
      sonMesaj,
      okunmamisSayisi,
    });
  }
  
  // Son mesaja göre azalan tarihte sırala
  return odalar.sort((a, b) => {
    const timeA = a.sonMesaj ? new Date(a.sonMesaj.tarih).getTime() : 0;
    const timeB = b.sonMesaj ? new Date(b.sonMesaj.tarih).getTime() : 0;
    return timeB - timeA;
  });
}

