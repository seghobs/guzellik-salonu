import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUyeByEmail, getAdmin, updateAdmin } from "../../../../lib/db";
import { signMemberToken, setMemberAuthCookie, signToken, setAuthCookie } from "../../../../lib/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, sifre } = await req.json();

    if (!email || !sifre) {
      return NextResponse.json(
        { message: "E-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    const identifier = email.trim().toLowerCase();

    // Check if logging in as admin (by username or admin email)
    if (identifier === "admin" || identifier === "admin@luxebeauty.com") {
      const admin = await getAdmin();
      const passwordMatch = await bcrypt.compare(sifre, admin.sifre_hash);
      if (passwordMatch) {
        const now = new Date().toISOString();
        await updateAdmin({ son_giris: now });

        const token = signToken({
          kullanici_adi: admin.kullanici_adi,
          email: admin.email,
        });

        await setAuthCookie(token);

        return NextResponse.json({
          success: true,
          message: "Yönetici girişi başarılı",
          isAdmin: true,
          admin: {
            kullanici_adi: admin.kullanici_adi,
            email: admin.email,
          },
        });
      } else {
        return NextResponse.json(
          { message: "Hatalı kullanıcı adı veya şifre" },
          { status: 401 }
        );
      }
    }

    const uye = await getUyeByEmail(email);

    if (!uye || !uye.kayitli_uye || !uye.sifre_hash) {
      return NextResponse.json(
        { message: "Hatalı e-posta veya şifre" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(sifre, uye.sifre_hash);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Hatalı e-posta veya şifre" },
        { status: 401 }
      );
    }

    // Sign member token
    const token = signMemberToken({
      id: uye.id,
      ad: uye.ad,
      email: uye.email,
    });

    await setMemberAuthCookie(token);

    // If the member has admin role, also sign admin token and set admin cookie!
    let isAdmin = false;
    if (uye.rol === "admin") {
      isAdmin = true;
      const adminToken = signToken({
        kullanici_adi: uye.ad,
        email: uye.email,
      });
      await setAuthCookie(adminToken);
    }

    return NextResponse.json({
      success: true,
      message: "Giriş başarılı",
      isAdmin,
      member: {
        id: uye.id,
        ad: uye.ad,
        email: uye.email,
      },
    });
  } catch (error) {
    console.error("Member Login API Error:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}
