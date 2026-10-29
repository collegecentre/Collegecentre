import { supabase } from "./supabase";
import type {
  AnalyticsEvent,
  AnalyticsEventType,
  AnalyticsDeviceType,
  AnalyticsTimeFilter,
  AnalyticsSummary,
  AnalyticsDailyPoint,
  AnalyticsTopContentItem,
  AnalyticsReferrerItem,
  AnalyticsDeviceBreakdown,
} from "@/types";

/**
 * Privacy-Conscious Device Detector
 * Classifies visitor environment without capturing any PII or fingerprinting identifiers.
 */
export function detectDeviceType(): AnalyticsDeviceType {
  if (typeof window === "undefined" || !navigator.userAgent) {
    return "desktop";
  }
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(ua)) {
    return "mobile";
  }
  if (/ipad|tablet|playbook|silk|android(?!.*mobile)/i.test(ua)) {
    return "tablet";
  }
  return "desktop";
}

/**
 * Privacy-Conscious Referrer Extractor
 * Strips sensitive query parameters, personal paths, and tokens.
 * Only returns the public hostname (e.g., 'github.com', 'linkedin.com') or 'direct'.
 */
export function extractReferrerHost(): string {
  if (typeof window === "undefined" || !document.referrer) {
    return "direct";
  }
  try {
    const url = new URL(document.referrer);
    // Exclude same-origin internal navigations
    if (url.origin === window.location.origin) {
      return "direct";
    }
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    return host || "direct";
  } catch {
    return "direct";
  }
}

interface TrackEventParams {
  profileId: string;
  eventType: AnalyticsEventType;
  resourceId?: string | null;
  resourceTitle?: string | null;
  referrerHost?: string | null;
  deviceType?: AnalyticsDeviceType | null;
}

// In-memory debounce cache to prevent click spamming within a short window
const clickDebounceMap = new Map<string, number>();

/**
 * Non-blocking, privacy-preserving event tracker.
 * NEVER throws or breaks the public student profile UI.
 */
export async function trackAnalyticsEvent({
  profileId,
  eventType,
  resourceId = null,
  resourceTitle = null,
  referrerHost = null,
  deviceType = null,
}: TrackEventParams): Promise<boolean> {
  if (!profileId) return false;

  try {
    // 1. Session-based deduplication for profile views (prevents reload spam)
    if (eventType === "profile_view" && typeof window !== "undefined") {
      const sessionKey = `cc_pv_${profileId}`;
      const lastViewTime = sessionStorage.getItem(sessionKey);
      const now = Date.now();
      // Deduplicate views within a 5-minute window per session
      if (lastViewTime && now - parseInt(lastViewTime, 10) < 5 * 60 * 1000) {
        return false;
      }
      try {
        sessionStorage.setItem(sessionKey, now.toString());
      } catch {
        // Ignore storage quota errors
      }
    }

    // 2. Debounce rapid duplicate clicks on the same element (< 800ms)
    if (eventType !== "profile_view" && resourceId) {
      const throttleKey = `${profileId}_${eventType}_${resourceId}`;
      const lastClick = clickDebounceMap.get(throttleKey) || 0;
      const now = Date.now();
      if (now - lastClick < 800) {
        return false;
      }
      clickDebounceMap.set(throttleKey, now);
    }

    const payload = {
      profile_id: profileId,
      event_type: eventType,
      resource_id: resourceId,
      resource_title: resourceTitle,
      referrer_host: referrerHost || extractReferrerHost(),
      device_type: deviceType || detectDeviceType(),
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("analytics_events").insert(payload);
    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Analytics] Event tracking warning:", error.message);
      }
      return false;
    }
    return true;
  } catch (err) {
    // Completely silent to protect visitor experience
    if (process.env.NODE_ENV === "development") {
      console.warn("[Analytics] Tracking call caught error:", err);
    }
    return false;
  }
}

/**
 * Formats a Date object to "MMM D" in UTC (e.g., "Oct 29")
 */
function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

/**
 * Formats a Date object to "YYYY-MM-DD" strictly in UTC
 */
function getUtcDateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Computes analytics summary metrics, time-series data points, and top content
 * for a student profile over a chosen time filter.
 */
export async function getAnalyticsSummary(
  profileId: string,
  timeFilter: AnalyticsTimeFilter = "30d"
): Promise<AnalyticsSummary> {
  const now = new Date();
  let days = 30;

  if (timeFilter === "7d") days = 7;
  else if (timeFilter === "30d") days = 30;
  else if (timeFilter === "90d") days = 90;
  else if (timeFilter === "all") days = 365;

  const nowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startUtc = new Date(nowUtc);
  startUtc.setUTCDate(startUtc.getUTCDate() - (days - 1));

  // Previous period start date for trend calculations
  const prevPeriodStartUtc = new Date(startUtc);
  prevPeriodStartUtc.setUTCDate(prevPeriodStartUtc.getUTCDate() - days);

  // Fetch all analytics events for this profile
  const { data: rawEvents, error } = await supabase
    .from("analytics_events")
    .select("*")
    .eq("profile_id", profileId);

  if (error || !rawEvents) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Analytics] Error loading summary:", error?.message);
    }
    return createEmptySummary(timeFilter, days);
  }

  const allEvents = rawEvents as AnalyticsEvent[];

  // Filter current period events
  const currentPeriodEvents = timeFilter === "all"
    ? allEvents
    : allEvents.filter((e) => new Date(e.created_at) >= startUtc);

  // Filter previous period events for comparison
  const previousPeriodEvents = timeFilter === "all"
    ? []
    : allEvents.filter((e) => {
        const d = new Date(e.created_at);
        return d >= prevPeriodStartUtc && d < startUtc;
      });

  // Calculate Overview Metrics
  let totalProfileViews = 0;
  let totalLinkClicks = 0;
  let totalProjectInteractions = 0;
  let totalResumeInteractions = 0;
  let totalShareEvents = 0;

  const linkCounts = new Map<string, { title: string; count: number; category?: string | null }>();
  const projectCounts = new Map<string, { title: string; count: number }>();
  const referrerCounts = new Map<string, number>();
  const deviceCounts: Record<AnalyticsDeviceType, number> = {
    desktop: 0,
    mobile: 0,
    tablet: 0,
    other: 0,
  };

  // Initialize continuous daily buckets map
  const dailyBucketsMap = new Map<string, AnalyticsDailyPoint>();
  for (let i = 0; i < days; i++) {
    const bucketDate = new Date(startUtc);
    bucketDate.setUTCDate(bucketDate.getUTCDate() + i);
    const key = getUtcDateKey(bucketDate);
    dailyBucketsMap.set(key, {
      date: key,
      label: formatDateLabel(bucketDate),
      profileViews: 0,
      linkClicks: 0,
      projectInteractions: 0,
      resumeInteractions: 0,
      totalEvents: 0,
    });
  }

  // Aggregate current period events
  currentPeriodEvents.forEach((event) => {
    const eventDate = new Date(event.created_at);
    const eventDateKey = getUtcDateKey(eventDate);
    const dailyPoint = dailyBucketsMap.get(eventDateKey);

    if (event.event_type === "profile_view") {
      totalProfileViews++;
      if (dailyPoint) {
        dailyPoint.profileViews++;
        dailyPoint.totalEvents++;
      }
    } else if (event.event_type === "link_click") {
      totalLinkClicks++;
      if (dailyPoint) {
        dailyPoint.linkClicks++;
        dailyPoint.totalEvents++;
      }
      if (event.resource_id) {
        const existing = linkCounts.get(event.resource_id) || {
          title: event.resource_title || "Direct Link",
          count: 0,
        };
        existing.count++;
        linkCounts.set(event.resource_id, existing);
      }
    } else if (event.event_type === "project_view" || event.event_type === "project_click") {
      totalProjectInteractions++;
      if (dailyPoint) {
        dailyPoint.projectInteractions++;
        dailyPoint.totalEvents++;
      }
      if (event.resource_id) {
        const existing = projectCounts.get(event.resource_id) || {
          title: event.resource_title || "Project",
          count: 0,
        };
        existing.count++;
        projectCounts.set(event.resource_id, existing);
      }
    } else if (event.event_type === "resume_view" || event.event_type === "resume_download") {
      totalResumeInteractions++;
      if (dailyPoint) {
        dailyPoint.resumeInteractions++;
        dailyPoint.totalEvents++;
      }
    } else if (event.event_type === "share_event") {
      totalShareEvents++;
      if (dailyPoint) {
        dailyPoint.totalEvents++;
      }
    }

    // Referrer aggregation
    const host = event.referrer_host || "direct";
    referrerCounts.set(host, (referrerCounts.get(host) || 0) + 1);

    // Device aggregation
    const dev = (event.device_type as AnalyticsDeviceType) || "desktop";
    if (deviceCounts[dev] !== undefined) {
      deviceCounts[dev]++;
    } else {
      deviceCounts.other++;
    }
  });

  // Calculate previous period metrics for trend indicator
  let prevProfileViews = 0;
  let prevLinkClicks = 0;
  previousPeriodEvents.forEach((e) => {
    if (e.event_type === "profile_view") prevProfileViews++;
    if (e.event_type === "link_click") prevLinkClicks++;
  });

  const viewsChangePercent = prevProfileViews > 0
    ? Math.round(((totalProfileViews - prevProfileViews) / prevProfileViews) * 100)
    : totalProfileViews > 0
    ? 100
    : null;

  const clicksChangePercent = prevLinkClicks > 0
    ? Math.round(((totalLinkClicks - prevLinkClicks) / prevLinkClicks) * 100)
    : totalLinkClicks > 0
    ? 100
    : null;

  const clickThroughRate = totalProfileViews > 0
    ? Math.round((totalLinkClicks / totalProfileViews) * 100)
    : 0;

  // Format Top Links
  const topLinks: AnalyticsTopContentItem[] = Array.from(linkCounts.entries())
    .map(([id, item]) => ({
      id,
      title: item.title,
      count: item.count,
      percentage: totalLinkClicks > 0 ? Math.round((item.count / totalLinkClicks) * 100) : 0,
      category: item.category || null,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Format Top Projects
  const topProjects: AnalyticsTopContentItem[] = Array.from(projectCounts.entries())
    .map(([id, item]) => ({
      id,
      title: item.title,
      count: item.count,
      percentage: totalProjectInteractions > 0 ? Math.round((item.count / totalProjectInteractions) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Format Top Referrers
  const totalReferrals = Array.from(referrerCounts.values()).reduce((a, b) => a + b, 0);
  const topReferrers: AnalyticsReferrerItem[] = Array.from(referrerCounts.entries())
    .map(([host, count]) => ({
      host,
      count,
      percentage: totalReferrals > 0 ? Math.round((count / totalReferrals) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Format Device Breakdown
  const totalDeviceEvents = currentPeriodEvents.length;
  const deviceBreakdown: AnalyticsDeviceBreakdown[] = [
    {
      device: "desktop",
      label: "Desktop & Laptops",
      count: deviceCounts.desktop,
      percentage: totalDeviceEvents > 0 ? Math.round((deviceCounts.desktop / totalDeviceEvents) * 100) : 0,
    },
    {
      device: "mobile",
      label: "Smartphones",
      count: deviceCounts.mobile,
      percentage: totalDeviceEvents > 0 ? Math.round((deviceCounts.mobile / totalDeviceEvents) * 100) : 0,
    },
    {
      device: "tablet",
      label: "Tablets & iPads",
      count: deviceCounts.tablet,
      percentage: totalDeviceEvents > 0 ? Math.round((deviceCounts.tablet / totalDeviceEvents) * 100) : 0,
    },
  ];

  return {
    timeFilter,
    metrics: {
      totalProfileViews,
      totalLinkClicks,
      totalProjectInteractions,
      totalResumeInteractions,
      totalShareEvents,
      clickThroughRate,
      viewsChangePercent,
      clicksChangePercent,
    },
    dailyPoints: Array.from(dailyBucketsMap.values()),
    topLinks,
    topProjects,
    topReferrers,
    deviceBreakdown,
    totalEventsCount: currentPeriodEvents.length,
  };
}

/**
 * Creates a clean default empty state when a student has 0 recorded analytics events.
 */
function createEmptySummary(timeFilter: AnalyticsTimeFilter, days: number): AnalyticsSummary {
  const now = new Date();
  const nowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startUtc = new Date(nowUtc);
  startUtc.setUTCDate(startUtc.getUTCDate() - (days - 1));

  const dailyPoints: AnalyticsDailyPoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startUtc);
    d.setUTCDate(d.getUTCDate() + i);
    dailyPoints.push({
      date: getUtcDateKey(d),
      label: formatDateLabel(d),
      profileViews: 0,
      linkClicks: 0,
      projectInteractions: 0,
      resumeInteractions: 0,
      totalEvents: 0,
    });
  }

  return {
    timeFilter,
    metrics: {
      totalProfileViews: 0,
      totalLinkClicks: 0,
      totalProjectInteractions: 0,
      totalResumeInteractions: 0,
      totalShareEvents: 0,
      clickThroughRate: 0,
      viewsChangePercent: null,
      clicksChangePercent: null,
    },
    dailyPoints,
    topLinks: [],
    topProjects: [],
    topReferrers: [],
    deviceBreakdown: [
      { device: "desktop", label: "Desktop & Laptops", count: 0, percentage: 0 },
      { device: "mobile", label: "Smartphones", count: 0, percentage: 0 },
      { device: "tablet", label: "Tablets & iPads", count: 0, percentage: 0 },
    ],
    totalEventsCount: 0,
  };
}
