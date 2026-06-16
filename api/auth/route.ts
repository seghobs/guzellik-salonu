import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdmin, updateAdmin, getUyeByEmail } from "../../../lib/db";
import { signToken, setAuthCookie, removeAuthCookie, isAuthenticated } from "../../../lib/utils/auth";

// GET: Check authentication status
export async function GET() {
  const authed = await isAuthenticated();
  return NextResponse.json({ authenticated: authed }, { status: authed ? 200 : 401 });
}

// POST: Admin login
export async function POST(req: NextRequest) {
  try {
    const { kullanici_adi, sifre } = await req.json();

    if (!kullanici_adi || !sifre) {
      return NextResponse.json(
        { message: "Kullanıcı adı ve şifre gereklidir" },
        { status: 400 }
      );
    }

    const admin = await getAdmin();
    let authenticated = false;
    let payload = { kullanici_adi: "", email: "" };

    // 1. Check default admin
    if (admin.kullanici_adi === kullanici_adi) {
      const passwordMatch = await bcrypt.compare(sifre, admin.sifre_hash);
      if (passwordMatch) {
        authenticated = true;
        const now = new Date().toISOString();
        await updateAdmin({ son_giris: now });
        payload = {
          kullanici_adi: admin.kullanici_adi,
          email: admin.email,
        };
      }
    }

    // 2. Check registered members with admin role
    if (!authenticated) {
      const member = await getUyeByEmail(kullanici_adi);
      if (member && member.rol === "admin" && member.sifre_hash) {
        const passwordMatch = await bcrypt.compare(sifre, member.sifre_hash);
        if (passwordMatch) {
          authenticated = true;
          payload = {
            kullanici_adi: member.ad,
            email: member.email,
          };
        }
      }
    }

    if (!authenticated) {
      return NextResponse.json(
        { message: "Hatalı kullanıcı adı veya şifre" },
        { status: 401 }
      );
    }

    // Sign JWT and set cookie
    const token = signToken(payload);
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: "Giriş başarılı",
      admin: payload,
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}

// DELETE: Admin logout
export async function DELETE() {
  await removeAuthCookie();
  return NextResponse.json({ success: true, message: "Çıkış yapıldı" });
}
