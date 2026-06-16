import { NextRequest, NextResponse } from "next/server";
import { getHizmetBySlug, getHizmetById, updateHizmet, deleteHizmet } from "../../../../lib/db";
import { isAuthenticated } from "../../../../lib/utils/auth";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  // Try finding by slug first, then by ID
  let service = await getHizmetBySlug(slug);
  if (!service) {
    service = await getHizmetById(slug);
  }

  if (!service) {
    return NextResponse.json({ message: "Hizmet bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(service);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
    }

    const { slug: identifier } = await params;
    // Find service to get its actual ID
    let service = await getHizmetBySlug(identifier);
    if (!service) {
      service = await getHizmetById(identifier);
    }

    if (!service) {
      return NextResponse.json({ message: "Hizmet bulunamadı" }, { status: 404 });
    }

    const body = await req.json();
    const updated = await updateHizmet(service.id, body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Hizmet güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
    }

    const { slug: identifier } = await params;
    let service = await getHizmetBySlug(identifier);
    if (!service) {
      service = await getHizmetById(identifier);
    }

    if (!service) {
      return NextResponse.json({ message: "Hizmet bulunamadı" }, { status: 404 });
    }

    await deleteHizmet(service.id);
    return NextResponse.json({ success: true, message: "Hizmet silindi" });
  } catch (error) {
    return NextResponse.json({ message: "Hizmet silinemedi" }, { status: 500 });
  }
}
