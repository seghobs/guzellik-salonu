import { NextRequest, NextResponse } from "next/server";
import { updateMusteri, deleteMusteri } from "../../../lib/db";
import { isAuthenticated } from "../../../lib/utils/auth";

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
    const updated = await updateMusteri(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Müşteri güncellenemedi" }, { status: 500 });
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

    await deleteMusteri(id);
    return NextResponse.json({ success: true, message: "Müşteri silindi" });
  } catch (error) {
    return NextResponse.json({ message: "Müşteri silinemedi" }, { status: 500 });
  }
}
