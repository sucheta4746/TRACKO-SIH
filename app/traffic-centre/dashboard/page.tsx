"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { KPICard } from "@/components/shared/KPICard";
import { TrafficHeatmap } from "@/components/shared/TrafficHeatmap";
import { AnimatedVehicles } from "@/components/shared/AnimatedVehicles";
import { GoogleMap } from "@/components/shared/GoogleMap";
import { AIOptimizationModule } from "@/components/shared/AIOptimizationModule";
import { AlertModal } from "@/components/shared/AlertModal";
import { OfflineBanner } from "@/components/shared/OfflineBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  trafficKPIs,
  trafficAlerts,
  intersections,
  vehicles,
  routeOptimizations,
  formatTimeAgo,
} from "@/lib/mockData";
import { useOfflineMode } from "@/hooks/useOfflineMode";
import {
  Bell,
  Clock,
  RefreshCw,
  ChevronRight,
  AlertTriangle,
  Car,
  Construction,
  Calendar,
  CloudRain,
} from "lucide-react";

const alertIcons = {
  accident: Car,
  congestion: AlertTriangle,
  roadwork: Construction,
  event: Calendar,
  weather: CloudRain,
};

const severityColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export default function TrafficCentreDashboard() {
  const [selectedAlert, setSelectedAlert] = useState<typeof trafficAlerts[0] | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isOffline, isSyncing, lastSynced } = useOfflineMode();

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  // Map markers from intersections and vehicles
  const mapMarkers = [
    ...intersections.map((i) => ({
      id: `intersection-${i.id}`,
      lat: i.lat,
      lng: i.lng,
      type: "intersection" as const,
      label: i.name,
      congestion: i.congestion,
    })),
    ...vehicles.slice(0, 3).map((v) => ({
      id: v.id,
      lat: v.lat,
      lng: v.lng,
      type: "vehicle" as const,
      label: `${v.type.charAt(0).toUpperCase() + v.type.slice(1)} - ${v.route}`,
      status: `${v.speed} mph`,
    })),
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] p-4 lg:p-6">
      <OfflineBanner isOffline={isOffline} isSyncing={isSyncing} lastSynced={lastSynced ?? undefined} />

      {/* Header */}
      <header className="mb-6 pt-12 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
              Traffic Control Centre
            </h1>
            <p className="text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "Loading live data..."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh Data
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Alerts</span>
              <Badge className="ml-2 bg-red-500 text-white text-xs">
                {trafficAlerts.filter((a) => a.severity === "high").length}
              </Badge>
            </Button>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {trafficKPIs.map((kpi, index) => (
          <div
            key={kpi.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <KPICard {...kpi} theme="dark" />
          </div>
        ))}
      </section>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column - Map and Traffic */}
        <div className="xl:col-span-2 space-y-6">
          {/* Google Map */}
          <div className="animate-slide-up animation-delay-200">
            <GoogleMap
              markers={mapMarkers}
              showTrafficLayer={true}
              height="350px"
              theme="dark"
            />
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Heatmap */}
            <div className="animate-slide-up animation-delay-300">
              <TrafficHeatmap intersections={intersections} theme="dark" />
            </div>

            {/* Animated Vehicles */}
            <div className="animate-slide-up animation-delay-400">
              <AnimatedVehicles vehicles={vehicles} theme="dark" />
            </div>
          </div>

          {/* AI Optimization */}
          <div className="animate-slide-up animation-delay-500">
            <AIOptimizationModule optimizations={routeOptimizations} theme="dark" />
          </div>
        </div>

        {/* Right column - Alerts */}
        <div className="space-y-6">
          {/* Active Alerts */}
          <Card className="bg-slate-900/50 border-slate-800 animate-slide-up animation-delay-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  Active Alerts
                </CardTitle>
                <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                  {trafficAlerts.length} active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
              {trafficAlerts.map((alert) => {
                const Icon = alertIcons[alert.type];
                return (
                  <button
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border transition-all duration-200",
                      "hover:scale-[1.01] hover:shadow-lg",
                      "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          alert.severity === "high"
                            ? "bg-red-500/20"
                            : alert.severity === "medium"
                            ? "bg-amber-500/20"
                            : "bg-emerald-500/20"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            alert.severity === "high"
                              ? "text-red-400"
                              : alert.severity === "medium"
                              ? "text-amber-400"
                              : "text-emerald-400"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={cn("text-xs", severityColors[alert.severity])}>
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {formatTimeAgo(alert.timestamp)}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-white truncate">
                          {alert.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 truncate">
                          {alert.location}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-slate-900/50 border-slate-800 animate-slide-up animation-delay-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-white">
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Traffic Sensors", status: "Online", count: "234/240", color: "bg-emerald-500" },
                { label: "Traffic Lights", status: "Operational", count: "892/900", color: "bg-emerald-500" },
                { label: "Cameras", status: "Active", count: "156/160", color: "bg-amber-500" },
                { label: "AI Processing", status: "Running", count: "98.5%", color: "bg-blue-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", item.color)} />
                    <span className="text-sm text-slate-300">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-white">{item.count}</span>
                    <span className="text-xs text-slate-500 ml-2">{item.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        alert={selectedAlert}
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        theme="dark"
      />
    </div>
  );
}
