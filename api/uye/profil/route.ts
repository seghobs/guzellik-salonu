import { NextResponse } from "next/server";
import { getAuthenticatedMember } from "../../../../lib/utils/auth";
import { getUyeById, getRandevular, getHizmetler, getPersonel, updateMusteri } from "../../../../lib/db";

export async function GET() {
  try {
    const memberSession = await getAuthenticatedMember();
    if (!memberSession) {
      return NextResponse.json({ message: "Oturum açmanız gerekmektedir." }, { status: 401 });
    }

    const member = await getUyeById(memberSession.id);
    if (!member) {
      return NextResponse.json({ message: "Üye bulunamadı." }, { status: 404 });
    }

    // Get appointments
    const appointments = await getRandevular();
    const memberAppointments = appointments.filter((r) => r.musteri_id === member.id);

    // Get services and staff for joining
    const services = await getHizmetler();
    const staff = await getPersonel();

    // Map appointments with service and staff details
    const mappedAppointments = memberAppointments.map((app) => {
      const srv = services.find((s) => s.id === app.hizmet_id);
      const stf = staff.find((p) => p.id === app.personel_id);
      return {
        ...app,
        hizmet_ad: srv ? srv.ad : "Bilinmeyen Hizmet",
        hizmet_gorsel: srv ? srv.gorsel : "",
        personel_ad: stf ? stf.ad : "Bilinmeyen Uzman",
        personel_unvan: stf ? stf.unvan : "",
      };
    });

    return NextResponse.json({
      success: true,
      member: {
        id: member.id,
        ad: member.ad,
        email: member.email,
        telefon: member.telefon,
        dogum_tarihi: member.dogum_tarihi || "",
        ilk_ziyaret: member.ilk_ziyaret,
        son_ziyaret: member.son_ziyaret,
        toplam_ziyaret: member.toplam_ziyaret,
        toplam_harcama: member.toplam_harcama,
      },
      appointments: mappedAppointments,
    });
  } catch (error) {
    console.error("Member Profile GET API Error:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const memberSession = await getAuthenticatedMember();
    if (!memberSession) {
      return NextResponse.json({ message: "Oturum açmanız gerekmektedir." }, { status: 401 });
    }

    const { ad, telefon, dogum_tarihi } = await req.json();

    if (!ad || !telefon) {
      return NextResponse.json({ message: "Ad ve telefon alanları zorunludur." }, { status: 400 });
    }

    const updated = await updateMusteri(memberSession.id, {
      ad,
      telefon,
      dogum_tarihi: dogum_tarihi || "",
    });

    return NextResponse.json({
      success: true,
      message: "Profiliniz başarıyla güncellendi.",
      member: {
        id: updated.id,
        ad: updated.ad,
        email: updated.email,
        telefon: updated.telefon,
        dogum_tarihi: updated.dogum_tarihi || "",
      },
    });
  } catch (error) {
    console.error("Member Profile PUT API Error:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}
