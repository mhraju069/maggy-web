import { MetadataRoute } from "next";

/**
 * Dynamically resolves the base URL based on environment:
 * 1. NEXT_PUBLIC_SITE_URL (custom domain or set in env)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (e.g. maggy-web.vercel.app)
 * 3. VERCEL_URL (preview/deployment branch domain)
 * 4. Fallback to default production domain
 */
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/+$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }
  return "https://heaven-on-earth.nl";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const currentDate = new Date();

  // All public searchable pages
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/philosophy", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/wellness", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/wellness/saltroom", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/lunchroom", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/menu", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/arrangements", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/activities", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/eventspace", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/memberships", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/booking", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/booking/sauna", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/booking/arrangements", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/booking/activities", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/booking/lunchroom", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/booking/packages", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/booking/eventspace", priority: 0.7, changeFrequency: "weekly" as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
