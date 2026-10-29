import { NextResponse } from "next/server.js";
import { supabase, isLiveSupabase } from "../../../lib/supabase.ts";

export async function GET() {
  const startTime = Date.now();

  let dbStatus = "connected";
  try {
    const { error } = await supabase.from("plans").select("id").limit(1);
    if (error) {
      dbStatus = isLiveSupabase ? "degraded" : "mock_fallback";
    } else {
      dbStatus = isLiveSupabase ? "connected" : "mock_fallback";
    }
  } catch {
    dbStatus = "error";
  }

  const latencyMs = Date.now() - startTime;

  const payload = {
    status: dbStatus === "error" ? "unhealthy" : "healthy",
    version: "2.0.0",
    service: "collegecentre-web",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || "development",
    latencyMs,
    checks: {
      database: dbStatus,
      storage: "ready",
      auth: "ready",
    },
  };

  return NextResponse.json(payload, {
    status: dbStatus === "error" ? 503 : 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
