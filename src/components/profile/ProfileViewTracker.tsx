"use client";

import * as React from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

interface ProfileViewTrackerProps {
  profileId: string;
}

export function ProfileViewTracker({ profileId }: ProfileViewTrackerProps) {
  React.useEffect(() => {
    if (!profileId) return;
    trackAnalyticsEvent({
      profileId,
      eventType: "profile_view",
    });
  }, [profileId]);

  return null;
}
