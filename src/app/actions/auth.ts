"use server";

import { prisma } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  getSession,
  SessionUser,
} from "@/lib/auth";

export async function registerUser(data: {
  name?: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string; user?: SessionUser }> {
  try {
    const cleanEmail = (data.email || "").trim().toLowerCase();
    const cleanPassword = data.password || "";
    const cleanName = (data.name || "").trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { success: false, error: "Format email tidak valid" };
    }

    if (cleanPassword.length < 6) {
      return {
        success: false,
        error: "Kata sandi minimal terdiri dari 6 karakter",
      };
    }

    // Check existing email
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return {
        success: false,
        error: "Email sudah terdaftar. Silakan masuk menggunakan akun Anda.",
      };
    }

    // If no admins exist yet or email contains "admin", automatically make ADMIN
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    const role =
      adminCount === 0 || cleanEmail.includes("admin") ? "ADMIN" : "USER";

    const hashedPassword = await hashPassword(cleanPassword);

    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        name: cleanName || cleanEmail.split("@")[0],
        password: hashedPassword,
        role: role as "USER" | "ADMIN",
      },
    });

    const sessionUser: SessionUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as "USER" | "ADMIN",
    };

    // Auto-login upon registration
    await createSession(sessionUser);

    return { success: true, user: sessionUser };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
    };
  }
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string; user?: SessionUser }> {
  try {
    const cleanEmail = (data.email || "").trim().toLowerCase();
    const cleanPassword = data.password || "";

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: "Harap isi email dan kata sandi" };
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.password) {
      return {
        success: false,
        error: "Email atau kata sandi tidak cocok",
      };
    }

    const isMatch = await verifyPassword(cleanPassword, user.password);
    if (!isMatch) {
      return {
        success: false,
        error: "Email atau kata sandi tidak cocok",
      };
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "USER" | "ADMIN",
    };

    await createSession(sessionUser);

    return { success: true, user: sessionUser };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat masuk. Silakan coba lagi.",
    };
  }
}

export async function logoutUser(): Promise<{ success: boolean }> {
  await destroySession();
  return { success: true };
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  return getSession();
}
