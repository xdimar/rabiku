import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rabiku.my.id";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/demo`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  try {
    const invitations = await prisma.invitation.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        updatedAt: true,
      },
      take: 500,
    });

    const dynamicRoutes: MetadataRoute.Sitemap = invitations.map((inv) => ({
      url: `${baseUrl}/${inv.slug}`,
      lastModified: inv.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap:", error);
    return staticRoutes;
  }
}
