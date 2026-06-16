import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUyeByEmail, addUye } from "../../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const { ad, telefon, email, sifre, dogum_tarihi } = await req.json();

    if (!ad || !telefon || !email || !sifre) {
      return NextResponse.json(
        { message: "Ad, telefon, e-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    // Check if email already registered
    const existingUye = await getUyeByEmail(email);
    if (existingUye && existingUye.kayitli_uye) {
      return NextResponse.json(
        { message: "Bu e-posta adresiyle kayıtlı bir üye zaten mevcut." },
        { status: 400 }
      );
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const sifre_hash = await bcrypt.hash(sifre, salt);

    if (existingUye) {
      // If customer already exists as a guest visitor, convert them to a registered member
      const db = await import("../../../../lib/db/jsonDb").then((m) => m.readDb());
      const custIndex = db.musteriler.findIndex((m) => m.id === existingUye.id);
      if (custIndex !== -1) {
        db.musteriler[custIndex].sifre_hash = sifre_hash;
        db.musteriler[custIndex].kayitli_uye = true;
        db.musteriler[custIndex].ad = ad; // Update name/phone to be sure
        db.musteriler[custIndex].telefon = telefon;
        db.musteriler[custIndex].dogum_tarihi = dogum_tarihi || db.musteriler[custIndex].dogum_tarihi;
        db.musteriler[custIndex].uye_olma_tarihi = new Date().toISOString();
        await import("../../../../lib/db/jsonDb").then((m) => m.writeDb(db));
      }
      
      return NextResponse.json({
        success: true,
        message: "Mevcut kaydınız başarıyla üyeliğe dönüştürüldü.",
      });
    } else {
      // Create new customer member
      await addUye({
        ad,
        telefon,
        email,
        dogum_tarihi: dogum_tarihi || "",
        sifre_hash,
        kayitli_uye: true,
      });

      return NextResponse.json({
        success: true,
        message: "Üyeliğiniz başarıyla oluşturuldu.",
      });
    }
  } catch (error) {
    console.error("Member Registration API Error:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}
