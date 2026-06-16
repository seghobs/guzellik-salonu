import { NextRequest, NextResponse } from "next/server";
import { getHizmetler, addHizmet } from "../../../lib/db";
import { isAuthenticated } from "../../../lib/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";
    
    const services = await getHizmetler(activeOnly);
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ message: "Hizmetler yüklenemedi" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
    }

    const body = await req.json();
    const { ad, kategori, sure_dk, fiyat, aciklama, detayli_aciklama, gorsel, aktif, one_cikan } = body;

    if (!ad || !kategori || !sure_dk || !fiyat || !aciklama || !gorsel) {
      return NextResponse.json({ message: "Eksik alanlar var" }, { status: 400 });
    }

    const newHizmet = await addHizmet({
      ad,
      kategori,
      sure_dk: Number(sure_dk),
      fiyat: Number(fiyat),
      aciklama,
      detayli_aciklama: detayli_aciklama || "",
      gorsel,
      aktif: aktif !== undefined ? Boolean(aktif) : true,
      one_cikan: one_cikan !== undefined ? Boolean(one_cikan) : false,
    });

    return NextResponse.json(newHizmet, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Hizmet eklenemedi" }, { status: 500 });
  }
}
