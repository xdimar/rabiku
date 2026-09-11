"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export type AttendanceStatus = "ATTENDING" | "NOT_ATTENDING" | "TENTATIVE";

/* ─── Invitation Layout Actions ─── */

export async function saveInvitationLayout(
  id: string,
  data: {
    layoutData: unknown;
    title?: string;
    groomName?: string;
    brideName?: string;
    audioUrl?: string;
    isPublished?: boolean;
  }
) {
  try {
    const session = await getSession();
    let userId = session?.id;
    if (!userId) {
      const user = await ensureDemoUser();
      userId = user?.id ?? "demo-user";
    }
    const layoutStr =
      typeof data.layoutData === "string"
        ? data.layoutData
        : JSON.stringify(data.layoutData);

    const invitation = await prisma.invitation.upsert({
      where: { id },
      update: {
        layoutData: layoutStr,
        ...(data.title && { title: data.title }),
        ...(data.groomName && { groomName: data.groomName }),
        ...(data.brideName && { brideName: data.brideName }),
        ...(data.audioUrl !== undefined && { audioUrl: data.audioUrl }),
        ...(data.isPublished !== undefined && {
          isPublished: data.isPublished,
        }),
      },
      create: {
        id,
        slug: id,
        title: data.title ?? "The Wedding of Raden & Kirana",
        userId,
        groomName: data.groomName ?? "Raden",
        brideName: data.brideName ?? "Kirana",
        layoutData: layoutStr,
        isPublished: data.isPublished ?? true,
      },
    });
    return { success: true, invitation };
  } catch (error) {
    console.error("Failed to save invitation layout:", error);
    return { success: false, error: "Gagal menyimpan undangan" };
  }
}

export async function getInvitationById(id: string) {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });
    if (!invitation) {
      if (id === "demo") {
        return {
          id: "demo",
          slug: "demo",
          title: "The Wedding of Raden & Kirana",
          groomName: "Raden",
          brideName: "Kirana",
          userId: "demo-user",
          layoutData: null,
          isPublished: true,
          audioUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      return null;
    }
    let parsedLayout = null;
    try {
      parsedLayout =
        typeof invitation.layoutData === "string"
          ? JSON.parse(invitation.layoutData)
          : invitation.layoutData;
    } catch {
      parsedLayout = invitation.layoutData;
    }
    return {
      ...invitation,
      layoutData: parsedLayout,
    };
  } catch (error) {
    console.error("Failed to fetch invitation:", error);
    return null;
  }
}

export async function getInvitationBySlug(slug: string) {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: {
        guestbook: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });
    if (!invitation) {
      if (slug === "preview-demo" || slug === "demo") {
        return {
          id: "demo",
          slug,
          title: "The Wedding of Raden & Kirana",
          groomName: "Raden",
          brideName: "Kirana",
          userId: "demo-user",
          layoutData: null,
          isPublished: true,
          audioUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          guestbook: [],
        };
      }
      return null;
    }
    let parsedLayout = null;
    try {
      parsedLayout =
        typeof invitation.layoutData === "string"
          ? JSON.parse(invitation.layoutData)
          : invitation.layoutData;
    } catch {
      parsedLayout = invitation.layoutData;
    }
    return {
      ...invitation,
      layoutData: parsedLayout,
    };
  } catch (error) {
    console.error("Failed to fetch invitation by slug:", error);
    return null;
  }
}

export async function createInvitation(data: {
  title: string;
  slug: string;
  userId?: string;
  groomName?: string;
  brideName?: string;
}) {
  try {
    let finalUserId = data.userId;
    if (!finalUserId) {
      const session = await getSession();
      if (session?.id) {
        finalUserId = session.id;
      } else {
        const demoUser = await ensureDemoUser();
        finalUserId = demoUser?.id ?? "demo-user";
      }
    }

    const invitation = await prisma.invitation.create({
      data: {
        title: data.title,
        slug: data.slug,
        userId: finalUserId,
        groomName: data.groomName ?? "",
        brideName: data.brideName ?? "",
        layoutData: JSON.stringify({ content: [], root: { props: {} } }),
      },
    });
    return { success: true, invitation };
  } catch (error) {
    console.error("Failed to create invitation:", error);
    return { success: false, error: "Gagal membuat undangan" };
  }
}

/* ─── Guestbook / RSVP Actions ─── */

export async function submitGuestbookEntry(data: {
  invitationId: string;
  guestName: string;
  attendanceStatus: AttendanceStatus;
  message?: string;
}) {
  try {
    const entry = await prisma.guestbookEntry.create({
      data: {
        invitationId: data.invitationId,
        guestName: data.guestName,
        attendanceStatus: data.attendanceStatus,
        message: data.message ?? null,
      },
    });
    return { success: true, entry };
  } catch (error) {
    console.error("Failed to submit guestbook entry:", error);
    return { success: false, error: "Gagal mengirim ucapan" };
  }
}

export async function getGuestbookEntries(invitationId: string) {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      where: { invitationId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return entries;
  } catch (error) {
    console.error("Failed to fetch guestbook entries:", error);
    return [];
  }
}

/* ─── Guest Management Actions ─── */

export async function getGuests(invitationId: string) {
  try {
    const guests = await prisma.guest.findMany({
      where: { invitationId },
      orderBy: { createdAt: "desc" },
    });
    return guests;
  } catch (error) {
    console.error("Failed to fetch guests:", error);
    return [];
  }
}

export async function addBulkGuests(
  invitationId: string,
  guestList: { name: string; phone?: string }[]
) {
  try {
    // Filter out empty names
    const validGuests = guestList
      .map((g) => ({
        invitationId,
        name: g.name.trim(),
        phone: g.phone?.trim() || null,
        isSent: false,
      }))
      .filter((g) => g.name.length > 0);

    if (validGuests.length === 0) {
      return { success: false, error: "Tidak ada nama tamu valid untuk ditambahkan" };
    }

    await prisma.guest.createMany({
      data: validGuests,
    });

    const allGuests = await prisma.guest.findMany({
      where: { invitationId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, count: validGuests.length, guests: allGuests };
  } catch (error) {
    console.error("Failed to add bulk guests:", error);
    return { success: false, error: "Gagal menyimpan daftar tamu" };
  }
}

export async function toggleGuestSent(guestId: string, isSent: boolean) {
  try {
    const guest = await prisma.guest.update({
      where: { id: guestId },
      data: { isSent },
    });
    return { success: true, guest };
  } catch (error) {
    console.error("Failed to toggle guest sent status:", error);
    return { success: false, error: "Gagal memperbarui status kirim" };
  }
}

export async function deleteGuest(guestId: string) {
  try {
    await prisma.guest.delete({
      where: { id: guestId },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete guest:", error);
    return { success: false, error: "Gagal menghapus tamu" };
  }
}

export async function getRSVPSummary(invitationId: string) {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      where: { invitationId },
      orderBy: { createdAt: "desc" },
    });

    const attending = entries.filter((e) => e.attendanceStatus === "ATTENDING").length;
    const notAttending = entries.filter((e) => e.attendanceStatus === "NOT_ATTENDING").length;
    const tentative = entries.filter((e) => e.attendanceStatus === "TENTATIVE").length;

    return {
      total: entries.length,
      attending,
      notAttending,
      tentative,
      entries,
    };
  } catch (error) {
    console.error("Failed to get RSVP summary:", error);
    return {
      total: 0,
      attending: 0,
      notAttending: 0,
      tentative: 0,
      entries: [],
    };
  }
}

/* ─── Demo Seed Helper ─── */

export async function ensureDemoUser() {
  try {
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: "demo@rabiku.my.id" },
          { email: "demo@nikahku.app" },
          { id: "demo-user" },
        ],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: "demo-user",
          email: "demo@rabiku.my.id",
          name: "Demo User",
        },
      });
    } else if (user.email !== "demo@rabiku.my.id") {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { email: "demo@rabiku.my.id" },
      });
    }

    return user;
  } catch (error) {
    console.error("Failed to ensure demo user:", error);
    return null;
  }
}

/* ─── Dashboard & Multi-Invitation Actions ─── */

export async function getAllInvitations() {
  try {
    const session = await getSession();
    let userId = session?.id;

    if (!userId) {
      const user = await ensureDemoUser();
      userId = user?.id ?? "demo-user";
    }

    const invitations = await prisma.invitation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: {
            guests: true,
            guestbook: true,
          },
        },
      },
    });

    // If empty for this user, automatically create an initial invitation
    if (invitations.length === 0) {
      const uniqueSlug = `undangan-${Math.random().toString(36).substring(2, 7)}`;
      const newId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const firstInv = await prisma.invitation.create({
        data: {
          id: newId,
          slug: uniqueSlug,
          title: "The Wedding of Raden & Kirana",
          userId,
          groomName: "Raden",
          brideName: "Kirana",
          layoutData: JSON.stringify({ content: [], root: { props: {} } }),
          isPublished: false,
        },
        include: {
          _count: {
            select: {
              guests: true,
              guestbook: true,
            },
          },
        },
      });
      return [firstInv];
    }

    return invitations;
  } catch (error) {
    console.error("Failed to fetch all invitations:", error);
    return [];
  }
}

export async function deleteInvitation(id: string) {
  try {
    await prisma.invitation.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete invitation:", error);
    return { success: false, error: "Gagal menghapus undangan" };
  }
}

export async function duplicateInvitation(
  id: string,
  newSlug: string,
  newTitle?: string
) {
  try {
    const original = await prisma.invitation.findUnique({
      where: { id },
    });
    if (!original) {
      return { success: false, error: "Undangan sumber tidak ditemukan" };
    }

    const session = await getSession();
    let userId = session?.id;
    if (!userId) {
      const user = await ensureDemoUser();
      userId = user?.id ?? "demo-user";
    }

    const cleanSlug = newSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    const existing = await prisma.invitation.findUnique({
      where: { slug: cleanSlug },
    });
    if (existing) {
      return {
        success: false,
        error: `Link/Slug '${cleanSlug}' sudah digunakan, silakan pilih link lain`,
      };
    }

    const newId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const duplicated = await prisma.invitation.create({
      data: {
        id: newId,
        slug: cleanSlug,
        title: newTitle || `${original.title} (Salinan)`,
        groomName: original.groomName,
        brideName: original.brideName,
        userId,
        layoutData: original.layoutData,
        audioUrl: original.audioUrl,
        isPublished: original.isPublished,
      },
    });

    return { success: true, invitation: duplicated };
  } catch (error) {
    console.error("Failed to duplicate invitation:", error);
    return { success: false, error: "Gagal menduplikasi undangan" };
  }
}

export async function updateInvitationAudio(
  id: string,
  audioUrl: string | null
) {
  try {
    const updated = await prisma.invitation.update({
      where: { id },
      data: { audioUrl },
    });
    return { success: true, audioUrl: updated.audioUrl };
  } catch (error) {
    console.error("Failed to update invitation audio:", error);
    return { success: false, error: "Gagal memperbarui musik latar" };
  }
}

