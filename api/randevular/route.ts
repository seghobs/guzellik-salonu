import { NextRequest, NextResponse } from "next/server";
import { getRandevular, addRandevu, getOrCreateMusteri, getHizmetById, getPersonelById } from "../../../lib/db";
import { calculateAvailableSlots } from "../../../lib/utils/timeSlots";
import { getAppointmentConfirmationTemplate } from "../../../lib/utils/emailTemplates";
import { isAuthenticated } from "../../../lib/utils/auth";

// GET: List all appointments (Admin only)
export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
    }
    const randevular = await getRandevular();
    return NextResponse.json(randevular);
  } catch (error) {
    return NextResponse.json({ message: "Randevular listesi alınamadı" }, { status: 500 });
  }
}

// POST: Create a new appointment (Public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      hizmet_id,
      personel_id,
      tarih,
      baslangic_saati,
      notlar,
      musteri: musteriInput, // { ad, telefon, email, dogum_tarihi }
    } = body;

    // Validate inputs
    if (!hizmet_id || !personel_id || !tarih || !baslangic_saati || !musteriInput || !musteriInput.ad || !musteriInput.telefon || !musteriInput.email) {
      return NextResponse.json({ message: "Gerekli alanlar eksiktir" }, { status: 400 });
    }

    // 1. Fetch Service and Staff
    const service = await getHizmetById(hizmet_id);
    const staff = await getPersonelById(personel_id);

    if (!service || !staff) {
      return NextResponse.json({ message: "Hizmet veya uzman bulunamadı" }, { status: 404 });
    }

    // 2. Double check slot availability
    const slots = await calculateAvailableSlots(tarih, personel_id);
    const chosenSlot = slots.find((s) => s.saat === baslangic_saati);
    if (!chosenSlot || !chosenSlot.musait) {
      return NextResponse.json({ message: "Seçtiğiniz tarih ve saat dilimi artık müsait değil" }, { status: 400 });
    }

    // 3. Create or Get Customer
    const customer = await getOrCreateMusteri({
      ad: musteriInput.ad,
      telefon: musteriInput.telefon,
      email: musteriInput.email,
      dogum_tarihi: musteriInput.dogum_tarihi || "",
      kayitli_uye: false,
    });

    // 4. Calculate end time (duration is in minutes)
    const [startH, startM] = baslangic_saati.split(":").map(Number);
    const durationMin = service.sure_dk;
    const endTotalMin = startH * 60 + startM + durationMin;
    const endH = Math.floor(endTotalMin / 60);
    const endM = endTotalMin % 60;
    const bitis_saati = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;

    // 5. Add Appointment
    const randevu = await addRandevu({
      musteri_id: customer.id,
      hizmet_id: service.id,
      personel_id: staff.id,
      tarih,
      baslangic_saati,
      bitis_saati,
      durum: "beklemede", // Wait for admin approval
      notlar: notlar || "",
      toplam_fiyat: service.fiyat,
    });

    // 6. Simulate email confirmation send
    console.log(`Sending confirmation email to ${customer.email}:`);
    const emailHtml = getAppointmentConfirmationTemplate({
      musteriAd: customer.ad,
      hizmetAd: service.ad,
      uzmanAd: staff.ad,
      tarih,
      saat: baslangic_saati,
      fiyat: service.fiyat,
      randevuId: randevu.id,
    });
    // In production, we'd call nodemailer sendMail...
    
    return NextResponse.json({
      success: true,
      message: "Randevu talebiniz başarıyla alındı",
      randevu,
    }, { status: 201 });

  } catch (error) {
    console.error("Post appointment error: ", error);
    return NextResponse.json({ message: "Randevu kaydı sırasında hata oluştu" }, { status: 500 });
  }
}
