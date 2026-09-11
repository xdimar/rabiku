"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function getAdminStats() {
  await requireAdmin();

  try {
    const [
      totalUsers,
      totalInvitations,
      totalGuests,
      totalRsvps,
      totalAdmins,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.invitation.count(),
      prisma.guest.count(),
      prisma.guestbookEntry.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
    ]);

    return {
      success: true,
      stats: {
        totalUsers,
        totalInvitations,
        totalGuests,
        totalRsvps,
        totalAdmins,
      },
    };
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return {
      success: false,
      error: "Gagal mengambil data statistik admin",
    };
  }
}

export async function getAllUsers() {
  await requireAdmin();

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            invitations: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, users };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { success: false, error: "Gagal memuat daftar pengguna" };
  }
}

export async function updateUserRole(
  userId: string,
  newRole: "USER" | "ADMIN"
) {
  const currentAdmin = await requireAdmin();

  if (currentAdmin.id === userId && newRole === "USER") {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });
    if (adminCount <= 1) {
      return {
        success: false,
        error: "Tidak dapat menurunkan role Anda karena Anda satu-satunya Administrator.",
      };
    }
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: { id: true, email: true, name: true, role: true },
    });

    return { success: true, user: updated };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { success: false, error: "Gagal mengubah hak akses pengguna" };
  }
}

export async function deleteUser(userId: string) {
  const currentAdmin = await requireAdmin();

  if (currentAdmin.id === userId) {
    return {
      success: false,
      error: "Anda tidak dapat menghapus akun Anda sendiri.",
    };
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Gagal menghapus pengguna" };
  }
}

export async function getAllPlatformInvitations() {
  await requireAdmin();

  try {
    const invitations = await prisma.invitation.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            guests: true,
            guestbook: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return { success: true, invitations };
  } catch (error) {
    console.error("Failed to fetch all platform invitations:", error);
    return { success: false, error: "Gagal memuat seluruh undangan platform" };
  }
}
