import type { MetadataRoute } from "next";
import { supabase } from "../lib/supabase.ts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://collegecentre.in";
  const now = new Date();

  // 1. Static Core Application Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/college`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // 2. Dynamic Public Profiles
  let profileRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("username, updated_at")
      .eq("is_public", true)
      .eq("is_discoverable", true);

    if (profiles && profiles.length > 0) {
      profileRoutes = (profiles as any[]).map((p: any) => ({
        url: `${baseUrl}/${p.username}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));
    }
  } catch {
    profileRoutes = [];
  }

  // 3. Dynamic College Campus Hubs
  let collegeRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: colleges } = await supabase
      .from("colleges")
      .select("slug, updated_at");

    if (colleges && colleges.length > 0) {
      collegeRoutes = (colleges as any[]).map((c: any) => ({
        url: `${baseUrl}/college/${c.slug}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }));
    }
  } catch {
    collegeRoutes = [];
  }

  return [...staticRoutes, ...profileRoutes, ...collegeRoutes];
}
