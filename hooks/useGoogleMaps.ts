"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LatLng,
  RouteInfo,
  TrafficData,
  getDirections,
  getTrafficFlow,
  geocodeAddress,
} from "@/lib/googleMapsHelper";
import { REFRESH_INTERVALS } from "@/lib/constants";

interface UseGoogleMapsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseGoogleMapsReturn {
  // State
  isLoading: boolean;
  error: string | null;
  currentLocation: LatLng | null;
  
  // Traffic data
  trafficData: TrafficData[];
  
  // Route data
  route: RouteInfo | null;
  
  // Actions
  getRoute: (origin: LatLng | string, destination: LatLng | string) => Promise<RouteInfo | null>;
  refreshTraffic: () => Promise<void>;
  setCurrentLocation: (location: LatLng) => void;
}

export function useGoogleMaps(options: UseGoogleMapsOptions = {}): UseGoogleMapsReturn {
  const { 
    autoRefresh = true, 
    refreshInterval = REFRESH_INTERVALS.trafficData 
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [route, setRoute] = useState<RouteInfo | null>(null);

  // Get user's current location
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to NYC if geolocation fails
          setCurrentLocation({ lat: 40.7128, lng: -74.006 });
        }
      );
    } else {
      setCurrentLocation({ lat: 40.7128, lng: -74.006 });
    }
  }, []);

  // Fetch traffic data
  const refreshTraffic = useCallback(async () => {
    if (!currentLocation) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getTrafficFlow(currentLocation, 10);
      setTrafficData(data);
    } catch (err) {
      setError("Failed to fetch traffic data");
      console.error("Traffic data error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentLocation]);

  // Get route between two points
  const getRoute = useCallback(async (
    origin: LatLng | string,
    destination: LatLng | string
  ): Promise<RouteInfo | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Geocode if string addresses are provided
      const originLatLng = typeof origin === "string" 
        ? await geocodeAddress(origin) 
        : origin;
      
      const destLatLng = typeof destination === "string"
        ? await geocodeAddress(destination)
        : destination;

      if (!originLatLng || !destLatLng) {
        throw new Error("Failed to geocode addresses");
      }

      const routeInfo = await getDirections(originLatLng, destLatLng);
      setRoute(routeInfo);
      return routeInfo;
    } catch (err) {
      setError("Failed to calculate route");
      console.error("Route calculation error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh traffic data
  useEffect(() => {
    if (!autoRefresh || !currentLocation) return;

    // Initial fetch
    refreshTraffic();

    // Set up interval
    const interval = setInterval(refreshTraffic, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, currentLocation, refreshInterval, refreshTraffic]);

  return {
    isLoading,
    error,
    currentLocation,
    trafficData,
    route,
    getRoute,
    refreshTraffic,
    setCurrentLocation,
  };
}
