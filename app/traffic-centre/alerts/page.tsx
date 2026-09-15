"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AlertModal } from "@/components/shared/AlertModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trafficAlerts, formatTimeAgo } from "@/lib/mockData";
import {
  Bell,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Car,
  Construction,
  Calendar,
  CloudRain,
  MapPin,
  Clock,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const alertIcons = {
  accident: Car,
  congestion: AlertTriangle,
  roadwork: Construction,
  event: Calendar,
  weather: CloudRain,
};

const severityColors = {
  high: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  medium: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  low: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
};

export default function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<typeof trafficAlerts[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);

  const filteredAlerts = trafficAlerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || alert.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleAcknowledge = (alertId: string) => {
    setAcknowledgedAlerts((prev) => [...prev, alertId]);
  };

  const alertCounts = {
    all: trafficAlerts.length,
    high: trafficAlerts.filter((a) => a.severity === "high").length,
    medium: trafficAlerts.filter((a) => a.severity === "medium").length,
    low: trafficAlerts.filter((a) => a.severity === "low").length,
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] p-4 lg:p-6">
      {/* Header */}
      <header className="mb-6 pt-12 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1 flex items-center gap-3">
              <Bell className="w-8 h-8 text-amber-400" />
              Traffic Alerts
            </h1>
            <p className="text-slate-400">
              Monitor and manage active traffic incidents and notifications
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-red-500/30 text-red-400 px-3 py-1">
              {alertCounts.high} Critical
            </Badge>
            <Badge variant="outline" className="border-amber-500/30 text-amber-400 px-3 py-1">
              {alertCounts.medium} Medium
            </Badge>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 px-3 py-1">
              {alertCounts.low} Low
            </Badge>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search alerts by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500"
          />
        </div>
        <div className="flex gap-2">
          {["all", "high", "medium", "low"].map((severity) => (
            <Button
              key={severity}
              variant="outline"
              size="sm"
              onClick={() => setSeverityFilter(severity)}
              className={cn(
                "capitalize",
                severityFilter === severity
                  ? severity === "high"
                    ? "bg-red-500/20 border-red-500/30 text-red-400"
                    : severity === "medium"
                    ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                    : severity === "low"
                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                    : "bg-blue-500/20 border-blue-500/30 text-blue-400"
                  : "border-slate-700 text-slate-400 hover:bg-slate-800"
              )}
            >
              {severity} ({alertCounts[severity as keyof typeof alertCounts]})
            </Button>
          ))}
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400 text-center">No alerts match your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert, index) => {
            const Icon = alertIcons[alert.type];
            const colors = severityColors[alert.severity];
            const isAcknowledged = acknowledgedAlerts.includes(alert.id);

            return (
              <Card
                key={alert.id}
                className={cn(
                  "bg-slate-900/50 border-slate-800 transition-all duration-300 animate-slide-up",
                  isAcknowledged && "opacity-60"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        colors.bg
                      )}
                    >
                      <Icon className={cn("w-6 h-6", colors.text)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge className={cn("text-xs", colors.bg, colors.text, colors.border)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                          {alert.type}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {formatTimeAgo(alert.timestamp)}
                        </span>
                        {isAcknowledged && (
                          <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Acknowledged
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-1">
                        {alert.title}
                      </h3>

                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                        {alert.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>Est. clear: {alert.estimatedClearTime}</span>
                        </div>
                      </div>

                      {/* Affected routes */}
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className="text-xs text-slate-500">Affected:</span>
                        {alert.affectedRoutes.map((route) => (
                          <span
                            key={route}
                            className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                          >
                            {route}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAlert(alert)}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                      {!isAcknowledged && (
                        <Button
                          size="sm"
                          onClick={() => handleAcknowledge(alert.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-white"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-slate-900 border-slate-800"
                        >
                          <DropdownMenuItem className="text-slate-300 hover:text-white">
                            Share Alert
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-slate-300 hover:text-white">
                            Add to Report
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:text-red-300">
                            Dismiss
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
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
