"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Locate,
  AlertTriangle,
  Car,
  Bus,
  Truck,
  RefreshCw,
  Zap,
} from "lucide-react";
import { getCongestionColor, getCongestionLabel } from "@/lib/mockData"
import type { AIDetectionEvent } from "@/lib/ai/types"
import { aiSeverityColor, formatDetectionType } from "@/lib/ai/types";

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: "vehicle" | "incident" | "intersection" | "bus" | "school" | "ai-detection";
  label?: string;
  aiDetectionData?: AIDetectionEvent;
  congestion?: number;
  status?: string;
}

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarker[];
  showTrafficLayer?: boolean;
  showControls?: boolean;
  showRoute?: boolean;
  height?: string;
  theme?: "dark" | "light";
  onMarkerClick?: (marker: MapMarker) => void;
  className?: string;
}

const markerIcons = {
  vehicle: Car,
  incident: AlertTriangle,
  intersection: MapPin,
  bus: Bus,
  school: MapPin,
  "ai-detection": Zap,
};

const markerColors = {
  vehicle: "bg-blue-500",
  incident: "bg-red-500",
  intersection: "bg-amber-500",
  bus: "bg-amber-500",
  school: "bg-emerald-500",
  "ai-detection": "bg-violet-500",
};

export function GoogleMap({
  center = { lat: 40.7128, lng: -74.006 },
  zoom = 12,
  markers = [],
  showTrafficLayer = true,
  showControls = true,
  height = "400px",
  theme = "dark",
  onMarkerClick,
  className,
}: GoogleMapProps) {
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [showLayers, setShowLayers] = useState(false);
  const [trafficVisible, setTrafficVisible] = useState(showTrafficLayer);
  const isDark = theme === "dark";
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.08 / currentZoom}%2C${center.lat - 0.06 / currentZoom}%2C${center.lng + 0.08 / currentZoom}%2C${center.lat + 0.06 / currentZoom}&layer=mapnik&marker=${center.lat}%2C${center.lng}`;

  // Simulate map refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    onMarkerClick?.(marker);
  };

  // Calculate marker positions based on map bounds (simplified visualization)
  const getMarkerPosition = (marker: MapMarker) => {
    const latDiff = (marker.lat - center.lat) * 100;
    const lngDiff = (marker.lng - center.lng) * 100;
    
    // Convert to percentage position (centered)
    const x = 50 + lngDiff * currentZoom * 2;
    const y = 50 - latDiff * currentZoom * 2;
    
    // Clamp to visible area
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    };
  };

  return (
    <Card className={cn(
      "overflow-hidden",
      isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200",
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            "text-lg font-semibold flex items-center gap-2",
            isDark ? "text-white" : "text-slate-900"
          )}>
            <Navigation className="w-5 h-5 text-blue-500" />
            Live Traffic Map
          </CardTitle>
          <div className="flex items-center gap-2">
            {trafficVisible && (
              <Badge variant="outline" className={cn(
                "text-xs",
                isDark ? "border-blue-500/30 text-blue-400" : "border-blue-500/30 text-blue-600"
              )}>
                Traffic Layer Active
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={cn(
                "h-8 w-8",
                isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 relative">
        {/* Map container */}
        <div 
          className={cn(
            "relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.18),transparent_34%),linear-gradient(135deg,#13213a,#0f172a)]",
            isDark ? "bg-slate-800" : "bg-slate-100"
          )}
          style={{ height }}
        >
          <iframe
            title="Live geographic map"
            src={mapUrl}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            aria-label={`OpenStreetMap area centered at ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`}
          />
          {/* Simulated map background */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            {/* Grid pattern (simulating streets) */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mapGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path
                    d={`M 60 0 L 0 0 0 60`}
                    fill="none"
                    stroke={isDark ? "#334155" : "#CBD5E1"}
                    strokeWidth="1"
                  />
                </pattern>
                <pattern id="majorRoads" width="180" height="180" patternUnits="userSpaceOnUse">
                  <line x1="90" y1="0" x2="90" y2="180" stroke={isDark ? "#475569" : "#94A3B8"} strokeWidth="3" />
                  <line x1="0" y1="90" x2="180" y2="90" stroke={isDark ? "#475569" : "#94A3B8"} strokeWidth="3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapGrid)" />
              <rect width="100%" height="100%" fill="url(#majorRoads)" />
            </svg>

            {/* Traffic overlay (color-coded roads) */}
            {trafficVisible && (
              <svg className="absolute inset-0 w-full h-full opacity-60">
                {/* Horizontal traffic lines */}
                <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#22C55E" strokeWidth="4" />
                <line x1="0" y1="50%" x2="45%" y2="50%" stroke="#22C55E" strokeWidth="6" />
                <line x1="45%" y1="50%" x2="65%" y2="50%" stroke="#FACC15" strokeWidth="6" />
                <line x1="65%" y1="50%" x2="100%" y2="50%" stroke="#EF4444" strokeWidth="6" />
                <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#84CC16" strokeWidth="4" />
                {/* Vertical traffic lines */}
                <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#22C55E" strokeWidth="4" />
                <line x1="50%" y1="0" x2="50%" y2="40%" stroke="#22C55E" strokeWidth="6" />
                <line x1="50%" y1="40%" x2="50%" y2="60%" stroke="#F97316" strokeWidth="6" />
                <line x1="50%" y1="60%" x2="50%" y2="100%" stroke="#22C55E" strokeWidth="6" />
                <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#84CC16" strokeWidth="4" />
              </svg>
            )}
          </div>

          {/* Markers */}
          {markers.map((marker) => {
            const pos = getMarkerPosition(marker);
            const Icon = markerIcons[marker.type];
            const bgColor = marker.congestion
              ? getCongestionColor(marker.congestion)
              : markerColors[marker.type];

            return (
              <button
                key={marker.id}
                onClick={() => handleMarkerClick(marker)}
                className={cn(
                  "absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2",
                  "rounded-full flex items-center justify-center",
                  "border-2 border-white shadow-lg",
                  "transition-all duration-300 hover:scale-125 hover:z-20",
                  "focus:outline-none focus:ring-2 focus:ring-white/50",
                  selectedMarker?.id === marker.id && "scale-125 z-20 ring-2 ring-white"
                )}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  backgroundColor: typeof bgColor === "string" && bgColor.startsWith("#") 
                    ? bgColor 
                    : undefined,
                }}
              >
                <Icon className="w-4 h-4 text-white" />
                {/* Pulse effect for incidents */}
                {marker.type === "incident" && (
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50" />
                )}
              </button>
            );
          })}

          {/* Selected marker popup */}
          {selectedMarker && (
            <div
              className={cn(
                "absolute z-30 p-3 rounded-lg shadow-xl min-w-[180px]",
                "animate-slide-up",
                isDark ? "bg-slate-900 border border-slate-700" : "bg-white border border-slate-200"
              )}
              style={{
                left: `${getMarkerPosition(selectedMarker).x}%`,
                top: `${getMarkerPosition(selectedMarker).y + 8}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="flex items-start gap-2 mb-2">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                  markerColors[selectedMarker.type]
                )}>
                  {(() => {
                    const Icon = markerIcons[selectedMarker.type];
                    return <Icon className="w-3 h-3 text-white" />;
                  })()}
                </div>
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    isDark ? "text-white" : "text-slate-900"
                  )}>
                    {selectedMarker.label || `${selectedMarker.type.charAt(0).toUpperCase() + selectedMarker.type.slice(1)} ${selectedMarker.id}`}
                  </p>
                  {selectedMarker.congestion !== undefined && (
                    <p className={cn(
                      "text-xs",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}>
                      {getCongestionLabel(selectedMarker.congestion)} - {selectedMarker.congestion}%
                    </p>
                  )}
                  {selectedMarker.status && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {selectedMarker.status}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="w-full text-xs"
                onClick={() => setSelectedMarker(null)}
              >
                Close
              </Button>
            </div>
          )}

          {/* Map controls */}
          {showControls && (
            <div className={cn(
              "absolute right-3 top-3 flex flex-col gap-2"
            )}>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setCurrentZoom(z => Math.min(20, z + 1))}
                className={cn(
                  "h-8 w-8 shadow-md",
                  isDark ? "bg-slate-900/90 hover:bg-slate-800" : "bg-white hover:bg-slate-50"
                )}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setCurrentZoom(z => Math.max(1, z - 1))}
                className={cn(
                  "h-8 w-8 shadow-md",
                  isDark ? "bg-slate-900/90 hover:bg-slate-800" : "bg-white hover:bg-slate-50"
                )}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setShowLayers(!showLayers)}
                className={cn(
                  "h-8 w-8 shadow-md",
                  isDark ? "bg-slate-900/90 hover:bg-slate-800" : "bg-white hover:bg-slate-50",
                  showLayers && "ring-2 ring-blue-500"
                )}
              >
                <Layers className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className={cn(
                  "h-8 w-8 shadow-md",
                  isDark ? "bg-slate-900/90 hover:bg-slate-800" : "bg-white hover:bg-slate-50"
                )}
              >
                <Locate className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Layers panel */}
          {showLayers && (
            <div className={cn(
              "absolute right-14 top-3 p-3 rounded-lg shadow-lg min-w-[160px]",
              "animate-slide-in-right",
              isDark ? "bg-slate-900 border border-slate-700" : "bg-white border border-slate-200"
            )}>
              <p className={cn(
                "text-xs font-medium mb-2",
                isDark ? "text-slate-400" : "text-slate-500"
              )}>
                Map Layers
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={trafficVisible}
                  onChange={(e) => setTrafficVisible(e.target.checked)}
                  className="rounded border-slate-600"
                />
                <span className={cn(
                  "text-sm",
                  isDark ? "text-white" : "text-slate-900"
                )}>
                  Traffic
                </span>
              </label>
            </div>
          )}

          {/* Scale indicator */}
          <div className={cn(
            "absolute bottom-3 left-3 flex items-center gap-2 px-2 py-1 rounded",
            isDark ? "bg-slate-900/90" : "bg-white/90"
          )}>
            <div className={cn(
              "w-12 h-0.5",
              isDark ? "bg-white" : "bg-slate-900"
            )} />
            <span className={cn(
              "text-xs",
              isDark ? "text-white" : "text-slate-900"
            )}>
              {Math.round(1000 / currentZoom)}m
            </span>
          </div>

          {/* Traffic legend */}
          {trafficVisible && (
            <div className={cn(
              "absolute bottom-3 right-3 flex items-center gap-3 px-3 py-2 rounded-lg",
              isDark ? "bg-slate-900/90" : "bg-white/90"
            )}>
              {[
                { color: "#22C55E", label: "Free" },
                { color: "#FACC15", label: "Moderate" },
                { color: "#EF4444", label: "Heavy" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-1 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className={cn(
                    "text-xs",
                    isDark ? "text-slate-300" : "text-slate-700"
                  )}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
