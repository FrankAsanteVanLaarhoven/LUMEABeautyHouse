"use client";

import { useEffect } from "react";

/** Fires once per mount — brand floor analytics */
export function FloorViewTracker({ brandSlug }: { brandSlug: string }) {
  useEffect(() => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandSlug, type: "floor_view" }),
    }).catch(() => {});
  }, [brandSlug]);
  return null;
}
