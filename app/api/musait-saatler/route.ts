import { NextRequest, NextResponse } from "next/server";
import { calculateAvailableSlots } from "../../../lib/utils/timeSlots";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tarih = searchParams.get("tarih");
    const personelId = searchParams.get("personel_id");

    if (!tarih || !personelId) {
      return NextResponse.json(
        { message: "tarih ve personel_id parametreleri gereklidir" },
        { status: 400 }
      );
    }

    const slots = await calculateAvailableSlots(tarih, personelId);
    return NextResponse.json(slots);
  } catch (error) {
    console.error("Free slots API Error:", error);
    return NextResponse.json(
      { message: "Müsait saatler hesaplanamadı" },
      { status: 500 }
    );
  }
}
