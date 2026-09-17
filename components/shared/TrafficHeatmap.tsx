"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getCongestionColor, getCongestionLabel } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, MapPin, Clock, TrendingUp } from "lucide-react";

interface Intersection {
  id: number;
  name: string;
  lat: number;
  lng: number;
  congestion: number;
  avgWait: string;
}

interface TrafficHeatmapProps {
  intersections: Intersection[];
  theme?: "dark" | "light";
}

export function TrafficHeatmap({ intersections, theme = "dark" }: TrafficHeatmapProps) {
  const [selectedIntersection, setSelectedIntersection] = useState<Intersection | null>(null);
  const isDark = theme === "dark";
  const congestionSummary = [
    { label: "Clear", count: intersections.filter((intersection) => intersection.congestion < 30).length, color: "bg-emerald-500" },
    { label: "Moderate", count: intersections.filter((intersection) => intersection.congestion >= 30 && intersection.congestion < 70).length, color: "bg-amber-400" },
    { label: "Heavy", count: intersections.filter((intersection) => intersection.congestion >= 70).length, color: "bg-red-500" },
  ];
  const latitudes = intersections.map((intersection) => intersection.lat);
  const longitudes = intersections.map((intersection) => intersection.lng);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const latitudeRange = Math.max(maxLat - minLat, 0.001);
  const longitudeRange = Math.max(maxLng - minLng, 0.001);

  return (
    <Card className={cn(
      "relative overflow-hidden",
      isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            "text-lg font-semibold",
            isDark ? "text-white" : "text-slate-900"
          )}>
            Traffic Heatmap
          </CardTitle>
          <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
            {["Free", "Light", "Moderate", "Heavy", "Severe"].map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: getCongestionColor([10, 30, 50, 70, 90][i]) 
                  }}
                />
                <span className={cn(
                  "text-xs hidden md:inline",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-3" aria-label="Traffic summary">
          {congestionSummary.map((item) => (
            <span key={item.label} className={cn("flex items-center gap-1.5 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
              <span className={cn("h-2 w-2 rounded-full", item.color)} />
              {item.count} {item.label}
            </span>
          ))}
          <span className={cn("ml-auto text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
            Click a junction for details
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {/* Simplified map visualization */}
        <div className={cn(
          "relative h-64 md:h-80 rounded-lg overflow-hidden",
          isDark ? "bg-slate-800/50" : "bg-slate-100"
        )}>
          {/* Grid background */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(${isDark ? 'rgba(100, 116, 139, 0.2)' : 'rgba(148, 163, 184, 0.3)'} 1px, transparent 1px),
                linear-gradient(90deg, ${isDark ? 'rgba(100, 116, 139, 0.2)' : 'rgba(148, 163, 184, 0.3)'} 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
            }}
          />

          {/* Road lines */}
          <svg className="absolute inset-0 w-full h-full opacity-40">
            <defs>
              <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isDark ? "#475569" : "#94a3b8"} />
                <stop offset="100%" stopColor={isDark ? "#475569" : "#94a3b8"} />
              </linearGradient>
            </defs>
            {/* Horizontal roads */}
            <line x1="0" y1="25%" x2="100%" y2="25%" stroke="url(#roadGradient)" strokeWidth="4" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="url(#roadGradient)" strokeWidth="6" />
            <line x1="0" y1="75%" x2="100%" y2="75%" stroke="url(#roadGradient)" strokeWidth="4" />
            {/* Vertical roads */}
            <line x1="25%" y1="0" x2="25%" y2="100%" stroke="url(#roadGradient)" strokeWidth="4" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="url(#roadGradient)" strokeWidth="6" />
            <line x1="75%" y1="0" x2="75%" y2="100%" stroke="url(#roadGradient)" strokeWidth="4" />
          </svg>

          {/* Intersection points */}
          {intersections.map((intersection, index) => {
            const xPosition = 8 + ((intersection.lng - minLng) / longitudeRange) * 84;
            const yPosition = 88 - ((intersection.lat - minLat) / latitudeRange) * 76;
            
            return (
              <button
                key={intersection.id}
                onClick={() => setSelectedIntersection(intersection)}
                aria-label={`${intersection.name}, ${getCongestionLabel(intersection.congestion)} traffic, ${intersection.congestion}% congestion`}
                title={`${intersection.name} - ${intersection.congestion}% congestion`}
                className={cn(
                  "absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2",
                  "rounded-full border-2 border-white/20",
                  "transition-all duration-300 hover:scale-150 hover:z-10",
                  "focus:outline-none focus:ring-2 focus:ring-white/50",
                  "animate-pulse-slow"
                )}
                style={{
                  left: `${xPosition}%`,
                  top: `${yPosition}%`,
                  backgroundColor: getCongestionColor(intersection.congestion),
                  animationDelay: `${index * 200}ms`,
                }}
              >
                {/* Ripple effect */}
                <span
                  className="absolute inset-0 rounded-full animate-ping-slow opacity-50"
                  style={{ backgroundColor: getCongestionColor(intersection.congestion) }}
                />
              </button>
            );
          })}

          {/* Selected intersection popup */}
          {selectedIntersection && (
            <div className={cn(
              "absolute top-4 right-4 p-4 rounded-xl shadow-xl z-20",
              "animate-slide-in-right min-w-[220px]",
              isDark ? "bg-slate-900 border border-slate-700" : "bg-white border border-slate-200"
            )}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIntersection(null);
                }}
                className={cn(
                  "absolute top-2 right-2 p-1 rounded-full",
                  isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
                )}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: getCongestionColor(selectedIntersection.congestion) }}
                />
                <div>
                  <h4 className={cn(
                    "font-semibold text-sm",
                    isDark ? "text-white" : "text-slate-900"
                  )}>
                    {selectedIntersection.name}
                  </h4>
                  <p className={cn(
                    "text-xs",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    {getCongestionLabel(selectedIntersection.congestion)} Traffic
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={cn(
                    "flex items-center gap-1.5",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    Congestion
                  </span>
                  <span className={cn(
                    "font-medium",
                    isDark ? "text-white" : "text-slate-900"
                  )}>
                    {selectedIntersection.congestion}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={cn(
                    "flex items-center gap-1.5",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    <Clock className="w-3.5 h-3.5" />
                    Avg. Wait
                  </span>
                  <span className={cn(
                    "font-medium",
                    isDark ? "text-white" : "text-slate-900"
                  )}>
                    {selectedIntersection.avgWait}
                  </span>
                </div>
              </div>

              {/* Congestion bar */}
              <div className="mt-3">
                <div className={cn(
                  "h-2 rounded-full overflow-hidden",
                  isDark ? "bg-slate-800" : "bg-slate-200"
                )}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${selectedIntersection.congestion}%`,
                      backgroundColor: getCongestionColor(selectedIntersection.congestion),
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
