import { NextResponse } from "next/server";
import { removeMemberAuthCookie } from "../../../../lib/utils/auth";

export async function DELETE() {
  await removeMemberAuthCookie();
  return NextResponse.json({ success: true, message: "Çıkış yapıldı" });
}
