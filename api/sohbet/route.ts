import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedMember, isAuthenticated } from "../../../lib/utils/auth";
import { getMesajlarByUyeId, addMesaj, markMesajlarAsRead, getSohbetOdalari } from "../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const memberSession = await getAuthenticatedMember();
    const isAdmin = await isAuthenticated();

    if (!memberSession && !isAdmin) {
      return NextResponse.json({ message: "Oturum açmanız gerekmektedir." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view");
    const uyeId = searchParams.get("uye_id");

    // Handle as Admin if logged in as Admin and requested admin view or a specific member's conversation
    if (isAdmin && (view === "admin" || uyeId)) {
      if (uyeId) {
        // Admin fetching specific conversation history
        const messages = await getMesajlarByUyeId(uyeId);
        // Mark member's messages as read by the admin
        await markMesajlarAsRead(uyeId, "admin");
        return NextResponse.json({ success: true, messages });
      } else {
        // Admin fetching list of active chat rooms/conversations
        const rooms = await getSohbetOdalari();
        return NextResponse.json({ success: true, rooms });
      }
    }

    // Handle as Member
    if (memberSession) {
      // Member fetching their own chat history
      const messages = await getMesajlarByUyeId(memberSession.id);
      // Mark admin's messages as read by the member
      await markMesajlarAsRead(memberSession.id, "uye");
      return NextResponse.json({ success: true, messages });
    }

    // Fallback if they are admin but didn't pass query parameters
    if (isAdmin) {
      const rooms = await getSohbetOdalari();
      return NextResponse.json({ success: true, rooms });
    }

    return NextResponse.json({ message: "Oturum açmanız gerekmektedir." }, { status: 401 });
  } catch (error) {
    console.error("Chat GET API Error:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const memberSession = await getAuthenticatedMember();
    const isAdmin = await isAuthenticated();

    if (!memberSession && !isAdmin) {
      return NextResponse.json({ message: "Oturum açmanız gerekmektedir." }, { status: 401 });
    }

    const { mesaj, uye_id } = await req.json();

    if (!mesaj || mesaj.trim() === "") {
      return NextResponse.json({ message: "Mesaj boş olamaz." }, { status: 400 });
    }

    // If admin is replying to a specific member
    if (isAdmin && uye_id) {
      // Message sent by the admin to a specific member
      const newMesaj = await addMesaj({
        uye_id,
        gonderici: "admin",
        mesaj: mesaj.trim(),
      });
      return NextResponse.json({ success: true, message: newMesaj });
    }

    // Message sent by the member
    if (memberSession) {
      const newMesaj = await addMesaj({
        uye_id: memberSession.id,
        gonderici: "uye",
        mesaj: mesaj.trim(),
      });
      return NextResponse.json({ success: true, message: newMesaj });
    }

    return NextResponse.json({ message: "Geçersiz istek veya yetki." }, { status: 400 });
  } catch (error) {
    console.error("Chat POST API Error:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}
