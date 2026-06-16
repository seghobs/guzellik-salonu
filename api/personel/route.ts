import { NextRequest, NextResponse } from "next/server";
import { getPersonel, addPersonel, updatePersonel, deletePersonel } from "../../../lib/db";
import { isAuthenticated } from "../../../lib/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    const staffList = await getPersonel(activeOnly);

    if (id) {
      const staff = staffList.find((p) => p.id === id);
      if (!staff) return NextResponse.json({ message: "Personel bulunamadı" }, { status: 404 });
      return NextResponse.json(staff);
    }

    if (slug) {
      const staff = staffList.find((p) => p.slug === slug);
      if (!staff) return NextResponse.json({ message: "Personel bulunamadı" }, { status: 404 });
      return NextResponse.json(staff);
    }

    return NextResponse.json(staffList);
  } catch (error) {
    return NextResponse.json({ message: "Personel listesi yüklenemedi" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
    }

    const body = await req.json();
    const { ad, unvan, bio, gorsel, uzmanlik_alanlari, hizmet_verdigi_hizmetler, musait_gunler, aktif } = body;

    if (!ad || !unvan || !bio || !gorsel || !uzmanlik_alanlari || !hizmet_verdigi_hizmetler || !musait_gunler) {
      return NextResponse.json({ message: "Eksik alanlar var" }, { status: 400 });
    }

    const newStaff = await addPersonel({
      ad,
      unvan,
      bio,
      gorsel,
      uzmanlik_alanlari,
      hizmet_verdigi_hizmetler,
      musait_gunler,
      aktif: aktif !== undefined ? Boolean(aktif) : true,
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Personel eklenemedi" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID parametresi gereklidir" }, { status: 400 });
    }

    const body = await req.json();
    const updated = await updatePersonel(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Personel güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID parametresi gereklidir" }, { status: 400 });
    }

    await deletePersonel(id);
    return NextResponse.json({ success: true, message: "Personel silindi" });
  } catch (error) {
    return NextResponse.json({ message: "Personel silinemedi" }, { status: 500 });
  }
}
