import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rabiku.my.id";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/demo", "/preview-demo"],
        disallow: ["/dashboard", "/admin", "/api/", "/editor/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
