"use server";

import { prisma } from "@/lib/db";

/* ─── Record a View ─── */

export async function recordInvitationView(data: {
  invitationId: string;
  viewerName?: string;
  userAgent?: string;
  referrer?: string;
}) {
  try {
    await prisma.invitationView.create({
      data: {
        invitationId: data.invitationId,
        viewerName: data.viewerName || null,
        userAgent: data.userAgent?.slice(0, 500) || null,
        referrer: data.referrer?.slice(0, 500) || null,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to record invitation view:", error);
    return { success: false };
  }
}

/* ─── Get Analytics Summary ─── */

export async function getInvitationAnalytics(invitationId: string) {
  try {
    const [totalViews, recentViews, viewsByDay] = await Promise.all([
      // Total views count
      prisma.invitationView.count({
        where: { invitationId },
      }),
      // Recent views (last 7 days)
      prisma.invitationView.findMany({
        where: {
          invitationId,
          viewedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { viewedAt: "desc" },
        take: 50,
      }),
      // Views grouped by day (last 30 days)
      prisma.invitationView.groupBy({
        by: ["viewedAt"],
        where: {
          invitationId,
          viewedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        _count: true,
        orderBy: { viewedAt: "asc" },
      }),
    ]);

    // Count unique viewer names
    const uniqueViewers = new Set(
      recentViews
        .filter((v) => v.viewerName)
        .map((v) => v.viewerName!.toLowerCase().trim())
    ).size;

    // Today's views
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayViews = recentViews.filter(
      (v) => v.viewedAt >= todayStart
    ).length;

    return {
      totalViews,
      todayViews,
      uniqueViewers,
      recentViews: recentViews.map((v) => ({
        id: v.id,
        viewerName: v.viewerName,
        viewedAt: v.viewedAt,
        referrer: v.referrer,
      })),
      dailyStats: viewsByDay.map((d) => ({
        date: d.viewedAt,
        count: d._count,
      })),
    };
  } catch (error) {
    console.error("Failed to get analytics:", error);
    return {
      totalViews: 0,
      todayViews: 0,
      uniqueViewers: 0,
      recentViews: [],
      dailyStats: [],
    };
  }
}
