"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { THEME_PRESETS, defaultThemeConfig } from "@/config/theme.config";
import { WEDDING_TEMPLATES } from "@/config/templates";
import {
  createInvitationSchema,
  guestbookEntrySchema,
  sanitizeLayoutData,
  sanitizeString,
} from "@/lib/validation";

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
    const rawLayoutStr =
      typeof data.layoutData === "string"
        ? data.layoutData
        : JSON.stringify(data.layoutData);
    const layoutStr = sanitizeLayoutData(rawLayoutStr);

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
    let invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: {
        guestbook: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    // Fallback 1: If not found by slug, search by id in case invitationId was passed
    if (!invitation) {
      invitation = await prisma.invitation.findUnique({
        where: { id: slug },
        include: {
          guestbook: {
            orderBy: { createdAt: "desc" },
            take: 50,
          },
        },
      });
    }

    // Fallback 2: If demo preview, check if saved demo record exists in DB
    if (!invitation && (slug === "preview-demo" || slug === "demo")) {
      invitation = await prisma.invitation.findFirst({
        where: {
          OR: [{ id: "demo" }, { slug: "demo" }, { slug: "preview-demo" }],
        },
        include: {
          guestbook: {
            orderBy: { createdAt: "desc" },
            take: 50,
          },
        },
      });
    }

    if (!invitation) {
      if (slug === "preview-demo" || slug === "demo") {
        return {
          id: "demo",
          slug: "preview-demo",
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
  templateType?: "blank" | "preset";
  presetId?: string;
}) {
  try {
    // Validate input with Zod
    const validation = createInvitationSchema.safeParse(data);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Input tidak valid";
      return { success: false, error: firstError };
    }

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

    const groom = data.groomName?.trim() || "Raden";
    const bride = data.brideName?.trim() || "Kirana";

    let layoutDataObj: unknown;

    if (data.templateType === "blank") {
      layoutDataObj = {
        content: [],
        root: {
          props: {
            themeConfig: defaultThemeConfig,
          },
        },
      };
    } else {
      const templateMatch = WEDDING_TEMPLATES.find((t) => t.id === data.presetId);
      if (templateMatch) {
        layoutDataObj = templateMatch.generateLayout(groom, bride);
      } else {
        const selectedPreset =
          THEME_PRESETS.find((p) => p.id === data.presetId) || THEME_PRESETS[0];

      layoutDataObj = {
        content: [
          {
            type: "CoverHero",
            props: {
              id: "cover-hero-1",
              title: "The Wedding of",
              groomName: groom,
              brideName: bride,
              weddingDate: "25 Oktober 2025",
              locationBadge: "Jakarta, Indonesia",
              coverImage:
                "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
              showGuestBadge: true,
              scrollButtonText: "Buka Undangan",
            },
          },
          {
            type: "CoupleProfile",
            props: {
              id: "couple-1",
              sectionTitle: "Mempelai Berbahagia",
              sectionSubtitle:
                "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.",
              groomName: groom,
              groomFullName: `${groom} Pratama, S.T.`,
              groomBio: "Putra pertama dari Bpk. Bambang & Ibu Sri Wahyuni",
              groomPhoto:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
              groomInstagram: "mempelai_pria",
              brideName: bride,
              brideFullName: `${bride} Anindya, S.Ked.`,
              brideBio: "Putri kedua dari Bpk. Hartono & Ibu Ratna Sari",
              bridePhoto:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
              brideInstagram: "mempelai_wanita",
            },
          },
          {
            type: "CountdownTimer",
            props: {
              id: "countdown-1",
              sectionTitle: "Menghitung Hari",
              targetDate: "2025-10-25T08:00:00",
              showDays: true,
              showHours: true,
              showMinutes: true,
              showSeconds: true,
            },
          },
          {
            type: "EventSchedule",
            props: {
              id: "events-1",
              sectionTitle: "Agenda Acara",
              events: [
                {
                  eventName: "Akad Nikah",
                  date: "Sabtu, 25 Oktober 2025",
                  time: "08:00 - 10:00 WIB",
                  venueName: "Masjid Agung Sunda Kelapa",
                  address:
                    "Jl. Taman Sunda Kelapa No.16, Menteng, Jakarta Pusat",
                  googleMapsUrl: "https://maps.google.com",
                  icon: "ring",
                },
                {
                  eventName: "Resepsi Pernikahan",
                  date: "Sabtu, 25 Oktober 2025",
                  time: "11:00 - 14:00 WIB",
                  venueName: "Grand Ballroom Hotel Indonesia Kempinski",
                  address: "Jl. M.H. Thamrin No.1, Menteng, Jakarta Pusat",
                  googleMapsUrl: "https://maps.google.com",
                  icon: "glass",
                },
              ],
            },
          },
          {
            type: "LoveStoryTimeline",
            props: {
              id: "story-1",
              sectionTitle: "Our Love Story",
              showStoryPhotos: false,
              showStoryYear: true,
              showStoryDescription: true,
              stories: [
                {
                  year: "2020",
                  title: "Pertama Bertemu",
                  description:
                    "Tak sengaja berjumpa di suatu sore yang teduh di sudut perpustakaan kota.",
                  photoUrl: "",
                },
                {
                  year: "2022",
                  title: "Mulai Melangkah Bersama",
                  description:
                    "Saling meyakinkan hati untuk membangun visi hidup berdua.",
                  photoUrl: "",
                },
                {
                  year: "2025",
                  title: "Menuju Pelaminan",
                  description:
                    "Mengikat janji suci di hadapan keluarga dan para sahabat tercinta.",
                  photoUrl: "",
                },
              ],
            },
          },
          {
            type: "PhotoGallery",
            props: {
              id: "gallery-1",
              sectionTitle: "Galeri Kenangan",
              showCaptions: false,
              images: [
                {
                  imageUrl:
                    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
                  caption: "Prewedding Moment",
                },
                {
                  imageUrl:
                    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
                  caption: "Our Journey",
                },
                {
                  imageUrl:
                    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop",
                  caption: "Together Forever",
                },
              ],
            },
          },
          {
            type: "DigitalGift",
            props: {
              id: "gift-1",
              sectionTitle: "Tanda Kasih & Amplop Digital",
              showBankAccounts: true,
              showCopyAccount: true,
              showQRIS: false,
              showPhysicalGift: false,
              physicalGiftAddress:
                "Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan 12150",
              physicalGiftRecipient: `${groom} & ${bride}`,
              accounts: [
                {
                  bankName: "Bank Central Asia (BCA)",
                  accountNumber: "8712345678",
                  accountHolder: groom,
                },
                {
                  bankName: "Bank Mandiri",
                  accountNumber: "1310012345678",
                  accountHolder: bride,
                },
              ],
              qrisImageUrl: "",
            },
          },
          {
            type: "RSVPGuestbook",
            props: {
              id: "rsvp-1",
              sectionTitle: "Konfirmasi Kehadiran & Doa Restu",
              sectionSubtitle:
                "Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
              showGuestCountSelect: true,
              showMessageField: true,
              showWishesFeed: true,
            },
          },
        ],
        root: {
          props: {
            themeConfig: selectedPreset.config,
          },
        },
      };
      }
    }

    const invitation = await prisma.invitation.create({
      data: {
        title: data.title,
        slug: data.slug,
        userId: finalUserId,
        groomName: data.groomName ?? "",
        brideName: data.brideName ?? "",
        layoutData: JSON.stringify(layoutDataObj),
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
    // Validate input with Zod
    const validation = guestbookEntrySchema.safeParse(data);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Input tidak valid";
      return { success: false, error: firstError };
    }

    const sanitizedName = sanitizeString(data.guestName.trim());
    const sanitizedMessage = data.message ? sanitizeString(data.message.trim()) : null;

    const entry = await prisma.guestbookEntry.create({
      data: {
        invitationId: data.invitationId,
        guestName: sanitizedName,
        attendanceStatus: data.attendanceStatus,
        message: sanitizedMessage,
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
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCount = entries.filter((e) => new Date(e.createdAt) > oneDayAgo).length;

    return {
      total: entries.length,
      attending,
      notAttending,
      tentative,
      recentCount,
      entries,
    };
  } catch (error) {
    console.error("Failed to get RSVP summary:", error);
    return {
      total: 0,
      attending: 0,
      notAttending: 0,
      tentative: 0,
      recentCount: 0,
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

