import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://collegecentre.in";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/api/",
        "/onboarding/",
        "/reset-password/",
        "/forgot-password/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
