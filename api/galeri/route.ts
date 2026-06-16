import { NextRequest, NextResponse } from "next/server";
import { getGaleri, addGaleriItem, deleteGaleriItem, updateGaleriItem } from "../../../lib/db";
import { isAuthenticated } from "../../../lib/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get("featured") === "true";

    const items = await getGaleri(featuredOnly);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ message: "Galeri yüklenemedi" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
    }

    const body = await req.json();
    const { baslik, kategori, gorsel, one_cikan, sira } = body;

    if (!baslik || !kategori || !gorsel) {
      return NextResponse.json({ message: "Eksik alanlar var" }, { status: 400 });
    }

    const newItem = await addGaleriItem({
      baslik,
      kategori,
      gorsel,
      one_cikan: one_cikan !== undefined ? Boolean(one_cikan) : false,
      sira: sira !== undefined ? Number(sira) : 99,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Galeri öğesi eklenemedi" }, { status: 500 });
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

    await deleteGaleriItem(id);
    return NextResponse.json({ success: true, message: "Galeri öğesi silindi" });
  } catch (error) {
    return NextResponse.json({ message: "Galeri öğesi silinemedi" }, { status: 500 });
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
    const updated = await updateGaleriItem(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Galeri öğesi güncellenemedi" }, { status: 500 });
  }
}
