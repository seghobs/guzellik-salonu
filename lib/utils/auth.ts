import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getAdmin, getUyeByEmail } from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "luxebeauty-super-secret-key-2025";
const COOKIE_NAME = "luxebeauty_token";

export interface AdminJwtPayload {
  kullanici_adi: string;
  email: string;
}

export function signToken(payload: AdminJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string): AdminJwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
  } catch (error) {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const decoded = verifyToken(token);
  if (!decoded) return false;

  // Verify against database username
  const admin = await getAdmin();
  if (admin.kullanici_adi === decoded.kullanici_adi) {
    return true;
  }

  // Verify against member with role admin
  if (decoded.email) {
    const member = await getUyeByEmail(decoded.email);
    if (member && member.rol === "admin") {
      return true;
    }
  }

  return false;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day in seconds
    path: "/",
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
}

// Üye Kimlik Doğrulama İşlemleri (Member Auth)
const MEMBER_COOKIE_NAME = "luxebeauty_member_token";

export interface MemberJwtPayload {
  id: string;
  ad: string;
  email: string;
}

export function signMemberToken(payload: MemberJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }); // 7 days expiration
}

export function verifyMemberToken(token: string): MemberJwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as MemberJwtPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthenticatedMember(): Promise<MemberJwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;
  if (!token) return null;

  return verifyMemberToken(token);
}

export async function setMemberAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(MEMBER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    path: "/",
  });
}

export async function removeMemberAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(MEMBER_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
}

