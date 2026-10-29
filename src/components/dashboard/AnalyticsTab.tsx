"use client";

import * as React from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointerClick,
  GitBranch,
  FileText,
  Share2,
  Globe,
  Smartphone,
  Laptop,
  Tablet,
  RefreshCw,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Lock,
  Calendar,
  Check,
  Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { getAnalyticsSummary } from "@/lib/analytics";
import { UpgradeModal } from "@/components/billing/UpgradeModal";
import { getUserEntitlements } from "@/lib/billing-service";
import type {
  Profile,
  SocialLink,
  AnalyticsTimeFilter,
  AnalyticsSummary,
  AnalyticsDailyPoint,
} from "@/types";
import { cn } from "@/lib/utils";

interface AnalyticsTabProps {
  profile: Profile;
  socialLinks?: SocialLink[];
}

export function AnalyticsTab({ profile }: AnalyticsTabProps) {
  const { toast } = useToast();
  const [timeFilter, setTimeFilter] = React.useState<AnalyticsTimeFilter>("30d");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [summary, setSummary] = React.useState<AnalyticsSummary | null>(null);
  const [hoveredPoint, setHoveredPoint] = React.useState<AnalyticsDailyPoint | null>(null);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [isPro, setIsPro] = React.useState(false);
  const [upgradeOpen, setUpgradeOpen] = React.useState(false);

  React.useEffect(() => {
    if (profile?.id) {
      getUserEntitlements(profile.id).then((ents) => {
        setIsPro(ents.isPro);
      });
    }
  }, [profile?.id]);

  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${profile.username}`
    : `https://collegecentre.in/${profile.username}`;

  // Load analytics summary
  const loadData = React.useCallback(async (filter: AnalyticsTimeFilter) => {
    try {
      const data = await getAnalyticsSummary(profile.id, filter);
      setSummary(data);
    } catch (err) {
      console.error("Failed to fetch analytics summary:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [profile.id]);

  React.useEffect(() => {
    setIsLoading(true);
    loadData(timeFilter);
  }, [timeFilter, loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData(timeFilter);
    toast({
      title: "Analytics Refreshed",
      description: "Aggregated real-time metrics updated successfully.",
      variant: "success",
    });
  };

  const handleCopyVanityUrl = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      setCopiedLink(true);
      toast({
        title: "Profile URL Copied",
        description: `${profileUrl} copied to your clipboard.`,
        variant: "success",
      });
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const metrics = summary?.metrics;
  const dailyPoints = summary?.dailyPoints || [];
  const topLinks = summary?.topLinks || [];
  const topProjects = summary?.topProjects || [];
  const topReferrers = summary?.topReferrers || [];
  const deviceBreakdown = summary?.deviceBreakdown || [];
  const hasEvents = (summary?.totalEventsCount || 0) > 0;

  // Maximum value for SVG chart vertical scaling
  const maxDailyValue = Math.max(
    ...dailyPoints.map((p) => Math.max(p.profileViews, p.linkClicks)),
    4
  );

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-brand" />
              <span>Analytics &amp; Insights</span>
            </h1>
            <Badge
              variant="outline"
              size="sm"
              className="text-[10px] font-mono text-emerald-500 border-emerald-500/30 bg-emerald-500/5 inline-flex items-center gap-1"
            >
              <ShieldCheck className="h-3 w-3" />
              Privacy-Conscious
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Cookie-free, anonymous interaction telemetry for your public showcase.
          </p>
        </div>

        {/* Time Filters & Action Bar */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <div className="inline-flex items-center p-1 rounded-xl bg-muted/60 border border-border/60">
            {(["7d", "30d", "90d", "all"] as AnalyticsTimeFilter[]).map((filter) => {
              const labels: Record<AnalyticsTimeFilter, string> = {
                "7d": "7 Days",
                "30d": "30 Days",
                "90d": "90 Days",
                all: "All Time",
              };
              const isProFilter = filter === "90d" || filter === "all";
              const isActive = timeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    if (isProFilter && !isPro) {
                      setUpgradeOpen(true);
                      return;
                    }
                    setTimeFilter(filter);
                  }}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-lg transition-all inline-flex items-center gap-1",
                    isActive
                      ? "bg-foreground text-background font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  )}
                >
                  <span>{labels[filter]}</span>
                  {isProFilter && !isPro && (
                    <Lock className="w-2.5 h-2.5 opacity-60" />
                  )}
                </button>
              );
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            title="Refresh metrics"
            className="h-8 px-2.5 gap-1.5 text-xs"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-brand")}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* 2. Primary Metrics Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Profile Views */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Profile Views</span>
            <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Eye className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                {isLoading ? "—" : (metrics?.totalProfileViews ?? 0).toLocaleString()}
              </span>
              {!isLoading && metrics?.viewsChangePercent !== null && metrics?.viewsChangePercent !== undefined && (
                <span
                  className={cn(
                    "text-[11px] font-mono font-medium inline-flex items-center gap-0.5",
                    metrics.viewsChangePercent >= 0 ? "text-emerald-500" : "text-amber-500"
                  )}
                >
                  {metrics.viewsChangePercent >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metrics.viewsChangePercent >= 0 ? `+${metrics.viewsChangePercent}%` : `${metrics.viewsChangePercent}%`}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Unique visitor sessions to your showcase
            </p>
          </div>
        </div>

        {/* Metric 2: Link Clicks */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Link Clicks</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <MousePointerClick className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                {isLoading ? "—" : (metrics?.totalLinkClicks ?? 0).toLocaleString()}
              </span>
              {!isLoading && metrics && (
                <span className="text-[11px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                  {metrics.clickThroughRate}% CTR
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Outbound navigations across your links
            </p>
          </div>
        </div>

        {/* Metric 3: Project Interactions */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Project Interactions</span>
            <div className="h-7 w-7 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center">
              <GitBranch className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                {isLoading ? "—" : (metrics?.totalProjectInteractions ?? 0).toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Modal reads, live demo &amp; code repo clicks
            </p>
          </div>
        </div>

        {/* Metric 4: Resume Engagement */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Resume &amp; Share Activity</span>
            <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                {isLoading ? "—" : ((metrics?.totalResumeInteractions ?? 0) + (metrics?.totalShareEvents ?? 0)).toLocaleString()}
              </span>
              {!isLoading && metrics && (
                <span className="text-[10px] font-mono text-muted-foreground">
                  {metrics.totalResumeInteractions} views/dl • {metrics.totalShareEvents} shares
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Verified CV previews &amp; profile shares
            </p>
          </div>
        </div>
      </div>

      {/* 3. Interactive Time Series Chart */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight flex items-center gap-2">
              <span>Traffic &amp; Engagement Activity</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Daily profile views and outbound link interactions over time.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block" />
              <span className="text-muted-foreground">Profile Views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-muted-foreground">Link Clicks</span>
            </div>
          </div>
        </div>

        {/* Hover inspection pill */}
        <div className="h-6 flex items-center text-xs font-mono">
          {hoveredPoint ? (
            <div className="inline-flex items-center gap-3 px-2.5 py-0.5 rounded-md bg-muted/80 border border-border/80 text-foreground">
              <span className="font-semibold">{hoveredPoint.label}</span>
              <span className="text-blue-500 font-medium">{hoveredPoint.profileViews} Views</span>
              <span className="text-emerald-500 font-medium">{hoveredPoint.linkClicks} Clicks</span>
              <span className="text-violet-500 font-medium">{hoveredPoint.projectInteractions} Projects</span>
            </div>
          ) : (
            <span className="text-muted-foreground text-[11px]">
              Hover over points or bars to inspect daily metrics.
            </span>
          )}
        </div>

        {/* Pure Responsive SVG Chart */}
        <div className="w-full h-56 relative select-none">
          {dailyPoints.length > 0 ? (
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${dailyPoints.length * 28} 160`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0, 40, 80, 120].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2={dailyPoints.length * 28}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeDasharray="3 3"
                />
              ))}

              {/* SVG Area Paths */}
              {(() => {
                const totalWidth = dailyPoints.length * 28;
                const step = totalWidth / Math.max(dailyPoints.length - 1, 1);

                const viewsPoints = dailyPoints.map((p, idx) => {
                  const x = idx * step;
                  const y = 140 - (p.profileViews / maxDailyValue) * 120;
                  return { x, y };
                });

                const clicksPoints = dailyPoints.map((p, idx) => {
                  const x = idx * step;
                  const y = 140 - (p.linkClicks / maxDailyValue) * 120;
                  return { x, y };
                });

                const viewsLinePath = viewsPoints.reduce(
                  (acc, curr, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${curr.x} ${curr.y}`,
                  ""
                );
                const viewsAreaPath = `${viewsLinePath} L ${totalWidth} 140 L 0 140 Z`;

                const clicksLinePath = clicksPoints.reduce(
                  (acc, curr, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${curr.x} ${curr.y}`,
                  ""
                );

                return (
                  <>
                    {/* Views Area Fill */}
                    <path d={viewsAreaPath} fill="url(#viewsGradient)" />

                    {/* Views Stroke */}
                    <path
                      d={viewsLinePath}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Clicks Stroke */}
                    <path
                      d={clicksLinePath}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="4 2"
                    />

                    {/* Interactive Points */}
                    {dailyPoints.map((p, idx) => {
                      const x = idx * step;
                      const yView = 140 - (p.profileViews / maxDailyValue) * 120;
                      const isHovered = hoveredPoint?.date === p.date;

                      return (
                        <g
                          key={p.date}
                          onMouseEnter={() => setHoveredPoint(p)}
                          onMouseLeave={() => setHoveredPoint(null)}
                          className="cursor-pointer"
                        >
                          {/* Invisible hover area */}
                          <rect
                            x={Math.max(0, x - step / 2)}
                            y="0"
                            width={step}
                            height="160"
                            fill="transparent"
                          />

                          {/* Interactive Dot for Views */}
                          <circle
                            cx={x}
                            cy={yView}
                            r={isHovered ? 5 : 2.5}
                            fill="#3b82f6"
                            className="transition-all duration-150"
                          />

                          {isHovered && (
                            <line
                              x1={x}
                              y1="0"
                              x2={x}
                              y2="140"
                              stroke="currentColor"
                              strokeOpacity="0.2"
                              strokeDasharray="2 2"
                            />
                          )}
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              No traffic recorded in this timeframe
            </div>
          )}
        </div>

        {/* X-Axis Date markers */}
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/40">
          <span>{dailyPoints[0]?.label || "Start"}</span>
          <span>
            {dailyPoints[Math.floor(dailyPoints.length / 2)]?.label || "Mid"}
          </span>
          <span>{dailyPoints[dailyPoints.length - 1]?.label || "Today"}</span>
        </div>
      </div>

      {/* 4. Top Content Breakdown: Top Links & Top Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Clicked Links */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-1.5">
                <MousePointerClick className="h-4 w-4 text-emerald-500" />
                <span>Top Clicked Links</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Most engaged outbound destinations on your profile.
              </p>
            </div>
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              {topLinks.length} Tracked
            </Badge>
          </div>

          {topLinks.length > 0 ? (
            <div className="space-y-2.5">
              {topLinks.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-mono font-bold text-muted-foreground shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-foreground truncate">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold font-mono text-foreground">
                        {item.count} {item.count === 1 ? "click" : "clicks"}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Percentage Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(item.percentage, 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl border border-dashed border-border text-muted-foreground space-y-1">
              <p className="text-xs font-medium text-foreground">No link clicks recorded</p>
              <p className="text-[11px]">Clicks will appear here once visitors navigate your links.</p>
            </div>
          )}
        </div>

        {/* Top Engaged Projects */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-1.5">
                <GitBranch className="h-4 w-4 text-violet-500" />
                <span>Top Engaged Projects</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Projects with the highest detail modal views and clicks.
              </p>
            </div>
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              {topProjects.length} Projects
            </Badge>
          </div>

          {topProjects.length > 0 ? (
            <div className="space-y-2.5">
              {topProjects.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-mono font-bold text-muted-foreground shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-foreground truncate">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold font-mono text-foreground">
                        {item.count} {item.count === 1 ? "event" : "events"}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Percentage Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(item.percentage, 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl border border-dashed border-border text-muted-foreground space-y-1">
              <p className="text-xs font-medium text-foreground">No project engagement yet</p>
              <p className="text-[11px]">Interactions will appear once visitors inspect your work.</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Referrers & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Referrer Sources */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-blue-500" />
              <span>Traffic Origins &amp; Referrers</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Anonymized hostnames where visitors discovered your link.
            </p>
          </div>

          {topReferrers.length > 0 ? (
            <div className="space-y-2">
              {topReferrers.map((ref) => (
                <div
                  key={ref.host}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-muted/20 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="font-mono font-medium text-foreground">
                      {ref.host === "direct" ? "Direct / Private Bookmark" : ref.host}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-muted-foreground">{ref.count}</span>
                    <Badge variant="outline" size="sm" className="text-[10px] py-0 px-1.5">
                      {ref.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl border border-dashed border-border text-muted-foreground">
              <p className="text-xs">No referrer data in this timeframe</p>
            </div>
          )}
        </div>

        {/* Device Distribution */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-1.5">
              <Laptop className="h-4 w-4 text-amber-500" />
              <span>Device Distribution</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Anonymous screen classification across visitors.
            </p>
          </div>

          <div className="space-y-3">
            {deviceBreakdown.map((dev) => {
              const Icon =
                dev.device === "mobile"
                  ? Smartphone
                  : dev.device === "tablet"
                  ? Tablet
                  : Laptop;

              return (
                <div key={dev.device} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-foreground font-medium">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      {dev.label}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {dev.count} ({dev.percentage}%)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        dev.device === "desktop"
                          ? "bg-blue-500"
                          : dev.device === "mobile"
                          ? "bg-emerald-500"
                          : "bg-amber-500"
                      )}
                      style={{ width: `${Math.max(dev.percentage, dev.count > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Actionable Share Card / Empty State Helper */}
      {!hasEvents && !isLoading && (
        <div className="p-6 sm:p-8 rounded-2xl border border-dashed border-border bg-muted/20 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto">
            <Sparkles className="h-6 w-6" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-foreground">
              Start Collecting Real Profile Analytics
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Share your verified student link on professional networks to record visitor traffic, link clicks, and project views.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-background border border-border max-w-sm w-full mx-auto justify-between">
            <span className="text-xs font-mono truncate text-muted-foreground pl-2 select-all">
              collegecentre.in/{profile.username}
            </span>
            <Button
              type="button"
              size="sm"
              onClick={handleCopyVanityUrl}
              className="h-7 px-3 text-xs gap-1 shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Link</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* 7. Privacy Commitment Note */}
      <div className="p-4 rounded-xl border border-border/50 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>
            CollegeCentre Analytics strictly avoids tracking IP addresses, browser fingerprints, or third-party advertising cookies.
          </span>
        </div>
        <span className="font-mono text-[10px] shrink-0 text-muted-foreground/80">
          Owner-Only RLS Access
        </span>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        featureName="90-Day & All-Time Traffic Analytics"
        userId={profile.id}
        onSuccess={() => {
          setIsPro(true);
        }}
      />
    </div>
  );
}
