"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { REFRESH_INTERVALS } from "@/lib/constants";

interface VehiclePosition {
  id: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
}

interface UseVehicleAnimationOptions {
  initialVehicles: VehiclePosition[];
  updateInterval?: number;
  bounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
}

interface UseVehicleAnimationReturn {
  vehicles: VehiclePosition[];
  isAnimating: boolean;
  startAnimation: () => void;
  stopAnimation: () => void;
  resetPositions: () => void;
}

const DEFAULT_BOUNDS = {
  minLat: 40.70,
  maxLat: 40.78,
  minLng: -74.02,
  maxLng: -73.95,
};

export function useVehicleAnimation({
  initialVehicles,
  updateInterval = REFRESH_INTERVALS.vehiclePosition,
  bounds = DEFAULT_BOUNDS,
}: UseVehicleAnimationOptions): UseVehicleAnimationReturn {
  const [vehicles, setVehicles] = useState<VehiclePosition[]>(initialVehicles);
  const [isAnimating, setIsAnimating] = useState(true);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate new position based on heading and speed
  const updatePosition = useCallback(
    (vehicle: VehiclePosition): VehiclePosition => {
      const speedFactor = vehicle.speed / 3600; // Convert mph to degrees per second (rough approximation)
      const headingRad = (vehicle.heading * Math.PI) / 180;

      let newLat = vehicle.lat + Math.cos(headingRad) * speedFactor * 0.01;
      let newLng = vehicle.lng + Math.sin(headingRad) * speedFactor * 0.01;

      // Keep within bounds
      if (newLat < bounds.minLat || newLat > bounds.maxLat) {
        newLat = vehicle.lat;
        // Reverse heading
        vehicle.heading = (vehicle.heading + 180) % 360;
      }

      if (newLng < bounds.minLng || newLng > bounds.maxLng) {
        newLng = vehicle.lng;
        // Reverse heading
        vehicle.heading = (vehicle.heading + 180) % 360;
      }

      // Add slight random variation to heading
      const headingVariation = (Math.random() - 0.5) * 10;
      const newHeading = (vehicle.heading + headingVariation + 360) % 360;

      // Vary speed slightly
      const speedVariation = (Math.random() - 0.5) * 5;
      const newSpeed = Math.max(5, Math.min(45, vehicle.speed + speedVariation));

      return {
        ...vehicle,
        lat: newLat,
        lng: newLng,
        heading: newHeading,
        speed: newSpeed,
      };
    },
    [bounds]
  );

  // Animation loop
  const animate = useCallback(() => {
    setVehicles((prevVehicles) => prevVehicles.map(updatePosition));
  }, [updatePosition]);

  // Start animation
  const startAnimation = useCallback(() => {
    setIsAnimating(true);
  }, []);

  // Stop animation
  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Reset positions
  const resetPositions = useCallback(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);

  // Effect to manage animation
  useEffect(() => {
    if (isAnimating) {
      animationRef.current = setInterval(animate, updateInterval);
    } else if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isAnimating, animate, updateInterval]);

  return {
    vehicles,
    isAnimating,
    startAnimation,
    stopAnimation,
    resetPositions,
  };
}
