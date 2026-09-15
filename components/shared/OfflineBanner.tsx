"use client";

import { cn } from "@/lib/utils";
import { WifiOff, RefreshCw } from "lucide-react";

interface OfflineBannerProps {
  isOffline: boolean;
  isSyncing?: boolean;
  lastSynced?: Date;
}

export function OfflineBanner({ isOffline, isSyncing, lastSynced }: OfflineBannerProps) {
  if (!isOffline && !isSyncing) return null;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 px-4 py-2",
      "flex items-center justify-center gap-3",
      "text-sm font-medium",
      "transition-all duration-300",
      isOffline
        ? "bg-amber-500 text-amber-950"
        : "bg-blue-500 text-white"
    )}>
      {isOffline ? (
        <>
          <WifiOff className="w-4 h-4" />
          <span>You are offline. Some features may be unavailable.</span>
          {lastSynced && (
            <span className="text-amber-800 text-xs">
              Last synced: {lastSynced.toLocaleTimeString()}
            </span>
          )}
        </>
      ) : isSyncing ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Syncing data...</span>
        </>
      ) : null}
    </div>
  );
}
