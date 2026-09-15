"use client";

import { useState, useEffect, useCallback } from "react";

interface UseOfflineModeReturn {
  isOffline: boolean;
  isSyncing: boolean;
  lastSynced: Date | null;
  pendingChanges: number;
  sync: () => Promise<void>;
}

export function useOfflineMode(): UseOfflineModeReturn {
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(0);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Auto-sync when coming back online
      if (pendingChanges > 0) {
        sync();
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    // Set initial state
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [pendingChanges]);

  // Simulate sync operation
  const sync = useCallback(async () => {
    if (isOffline || isSyncing) return;

    setIsSyncing(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset pending changes after successful sync
      setPendingChanges(0);
      setLastSynced(new Date());
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOffline, isSyncing]);

  // Periodic sync when online
  useEffect(() => {
    if (isOffline) return;

    const interval = setInterval(() => {
      setLastSynced(new Date());
    }, 30000); // Update last synced every 30 seconds

    return () => clearInterval(interval);
  }, [isOffline]);

  // Initialize last synced on mount
  useEffect(() => {
    setLastSynced(new Date());
  }, []);

  return {
    isOffline,
    isSyncing,
    lastSynced,
    pendingChanges,
    sync,
  };
}
