import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "asset-valet-secret-key-2024");

export interface Session {
  userId: number;
  username: string;
  fullName: string;
  role: "admin" | "employee";
}

export async function signToken(payload: Session): Promise<string> {
  return new SignJWT({ ...payload }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("8h").sign(SECRET);
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as Session;
  } catch { return null; }
}

export async function getSession(): Promise<Session | null> {
  const token = cookies().get("av_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
