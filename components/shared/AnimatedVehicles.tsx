"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Bus, Truck, X } from "lucide-react";

interface Vehicle {
  id: string;
  type: "car" | "bus" | "truck";
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  route: string;
}

interface AnimatedVehiclesProps {
  vehicles: Vehicle[];
  theme?: "dark" | "light";
}

const vehicleIcons = {
  car: Car,
  bus: Bus,
  truck: Truck,
};

const vehicleColors = {
  car: "text-blue-400",
  bus: "text-amber-400",
  truck: "text-emerald-400",
};

export function AnimatedVehicles({ vehicles: initialVehicles, theme = "dark" }: AnimatedVehiclesProps) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const isDark = theme === "dark";
  const latitudes = vehicles.map((vehicle) => vehicle.lat);
  const longitudes = vehicles.map((vehicle) => vehicle.lng);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const latitudeRange = Math.max(maxLat - minLat, 0.001);
  const longitudeRange = Math.max(maxLng - minLng, 0.001);

  // Simulate vehicle movement
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        lat: vehicle.lat + (Math.random() - 0.5) * 0.001,
        lng: vehicle.lng + (Math.random() - 0.5) * 0.001,
        speed: Math.max(5, Math.min(60, vehicle.speed + (Math.random() - 0.5) * 5)),
        heading: (vehicle.heading + (Math.random() - 0.5) * 20 + 360) % 360,
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={cn(
      "overflow-hidden",
      isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            "text-lg font-semibold",
            isDark ? "text-white" : "text-slate-900"
          )}>
            Live Vehicle Tracking
          </CardTitle>
          <div className="flex items-center gap-4">
            {Object.entries(vehicleIcons).map(([type, Icon]) => (
              <div key={type} className="flex items-center gap-1.5">
                <Icon className={cn("w-4 h-4", vehicleColors[type as keyof typeof vehicleColors])} />
                <span className={cn(
                  "text-xs capitalize",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  {type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className={cn(
          "relative h-48 rounded-lg overflow-hidden",
          isDark ? "bg-slate-800/50" : "bg-slate-100"
        )}>
          {/* Grid background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(${isDark ? 'rgba(100, 116, 139, 0.3)' : 'rgba(148, 163, 184, 0.4)'} 1px, transparent 1px),
                linear-gradient(90deg, ${isDark ? 'rgba(100, 116, 139, 0.3)' : 'rgba(148, 163, 184, 0.4)'} 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Animated vehicles */}
          {vehicles.map((vehicle, index) => {
            const Icon = vehicleIcons[vehicle.type];
            const x = 8 + ((vehicle.lng - minLng) / longitudeRange) * 84;
            const y = 88 - ((vehicle.lat - minLat) / latitudeRange) * 76;
            
            return (
              <div
                key={vehicle.id}
                role="button"
                tabIndex={0}
                aria-label={`${vehicle.type} on ${vehicle.route}, ${Math.round(vehicle.speed)} miles per hour`}
                onClick={() => setSelectedVehicle(vehicle)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") setSelectedVehicle(vehicle);
                }}
                className={cn(
                  "absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2",
                  "transition-all duration-1000 ease-out",
                  "animate-vehicle-move"
                )}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  animationDelay: `${index * 500}ms`,
                }}
              >
                {/* Vehicle glow */}
                <div className={cn(
                  "absolute inset-0 rounded-full blur-md opacity-50",
                  vehicle.type === "car" ? "bg-blue-500" :
                  vehicle.type === "bus" ? "bg-amber-500" : "bg-emerald-500"
                )} />
                
                {/* Vehicle icon */}
                <div className={cn(
                  "relative w-full h-full rounded-full flex items-center justify-center",
                  isDark ? "bg-slate-900" : "bg-white",
                  "border-2",
                  vehicle.type === "car" ? "border-blue-400" :
                  vehicle.type === "bus" ? "border-amber-400" : "border-emerald-400"
                )}>
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      vehicleColors[vehicle.type]
                    )}
                    style={{
                      transform: `rotate(${vehicle.heading}deg)`,
                    }}
                  />
                </div>

                {/* Speed indicator */}
                <div className={cn(
                  "absolute -bottom-5 left-1/2 -translate-x-1/2",
                  "text-[10px] font-medium whitespace-nowrap",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  {Math.round(vehicle.speed)} mph
                </div>
              </div>
            );
          })}

          {selectedVehicle && (
            <div className={cn(
              "absolute left-3 top-3 z-10 min-w-[170px] rounded-lg border p-3 shadow-xl",
              isDark ? "border-slate-700 bg-slate-950/95" : "border-slate-200 bg-white/95"
            )}>
              <button
                type="button"
                aria-label="Close vehicle details"
                onClick={() => setSelectedVehicle(null)}
                className={cn("absolute right-2 top-2", isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-900")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <p className={cn("text-[10px] font-semibold uppercase tracking-wider", isDark ? "text-slate-500" : "text-slate-400")}>
                Live {selectedVehicle.type}
              </p>
              <p className={cn("mt-1 text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>{selectedVehicle.route}</p>
              <p className={cn("mt-1 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                {Math.round(selectedVehicle.speed)} mph · heading {Math.round(selectedVehicle.heading)}°
              </p>
            </div>
          )}

          {/* Vehicle count badge */}
          <div className={cn(
            "absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-sm font-medium",
            isDark
              ? "bg-slate-900/90 text-white border border-slate-700"
              : "bg-white/90 text-slate-900 border border-slate-200"
          )}>
            {vehicles.length} Active Vehicles
          </div>
        </div>

        {/* Vehicle stats */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { type: "car", label: "Cars", count: vehicles.filter(v => v.type === "car").length },
            { type: "bus", label: "Buses", count: vehicles.filter(v => v.type === "bus").length },
            { type: "truck", label: "Trucks", count: vehicles.filter(v => v.type === "truck").length },
          ].map(({ type, label, count }) => {
            const Icon = vehicleIcons[type as keyof typeof vehicleIcons];
            return (
              <div
                key={type}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg",
                  isDark ? "bg-slate-800/50" : "bg-slate-50"
                )}
              >
                <Icon className={cn("w-4 h-4", vehicleColors[type as keyof typeof vehicleColors])} />
                <div>
                  <p className={cn(
                    "text-xs",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    {label}
                  </p>
                  <p className={cn(
                    "text-sm font-semibold",
                    isDark ? "text-white" : "text-slate-900"
                  )}>
                    {count}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
