import { NextRequest, NextResponse } from "next/server";
import { getRandevuById, updateRandevu, deleteRandevu } from "../../../../lib/db";
import { isAuthenticated } from "../../../../lib/utils/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
    }

    const { id } = await params;
    const randevu = await getRandevuById(id);

    if (!randevu) {
      return NextResponse.json({ message: "Randevu bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(randevu);
  } catch (error) {
    return NextResponse.json({ message: "Randevu alınamadı" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
    }

    const { id } = await params;
    const randevu = await getRandevuById(id);

    if (!randevu) {
      return NextResponse.json({ message: "Randevu bulunamadı" }, { status: 404 });
    }

    const body = await req.json();
    // Allow updating status (durum), notes (notlar), and dates if needed
    const updated = await updateRandevu(id, body);
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Randevu güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
    }

    const { id } = await params;
    const randevu = await getRandevuById(id);

    if (!randevu) {
      return NextResponse.json({ message: "Randevu bulunamadı" }, { status: 404 });
    }

    await deleteRandevu(id);
    return NextResponse.json({ success: true, message: "Randevu silindi" });
  } catch (error) {
    return NextResponse.json({ message: "Randevu silinemedi" }, { status: 500 });
  }
}
