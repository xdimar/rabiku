import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
}

const AUTH_COOKIE_NAME = "rabiku_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "rabiku-super-secret-jwt-key-2026-wedding-builder"
);
const SESSION_EXPIRATION = "7d"; // 7 days session

/* ─── Password Utilities ─── */

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/* ─── Session Management ─── */

export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRATION)
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });

  return token;
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return {
      id: payload.id as string,
      email: payload.email as string,
      name: (payload.name as string) || null,
      role: (payload.role as "USER" | "ADMIN") || "USER",
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/* ─── Route Guards ─── */

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return user;
}
