import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getContactMessageTemplate } from "../../../lib/utils/emailTemplates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { adSoyad, email, telefon, konu, mesaj } = body;

    if (!adSoyad || !email || !telefon || !konu || !mesaj) {
      return NextResponse.json({ message: "Lütfen tüm alanları doldurunuz" }, { status: 400 });
    }

    console.log("Contact form message received:");
    console.log(`From: ${adSoyad} (${email}) - Tel: ${telefon}`);
    console.log(`Subject: ${konu}`);
    console.log(`Message: ${mesaj}`);

    // Mock nodemailer dispatch
    // In production, we'd configure:
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ from, to, html: getContactMessageTemplate(body) });
    
    // Simulate slight delay for realism
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: "Mesajınız başarıyla gönderildi",
    });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ message: "Mesaj iletilemedi" }, { status: 500 });
  }
}
