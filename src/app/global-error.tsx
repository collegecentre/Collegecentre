"use client";

import React, { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Root layout critical crash", error, { digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 font-sans antialiased">
        <div className="w-full max-w-md p-8 rounded-2xl border border-zinc-800 bg-zinc-900 text-center space-y-5 shadow-2xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-lg">
            CC
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">System Error</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              An unrecoverable application error occurred. Click below to reload the platform.
            </p>
          </div>

          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition"
          >
            Reload Platform
          </button>
        </div>
      </body>
    </html>
  );
}
