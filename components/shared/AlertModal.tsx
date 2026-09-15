"use client";

import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Car,
  Construction,
  Calendar,
  CloudRain,
  Clock,
  MapPin,
  Route,
  CheckCircle2,
  Share2,
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

interface Alert {
  id: string;
  type: "accident" | "congestion" | "roadwork" | "event" | "weather";
  severity: "high" | "medium" | "low";
  title: string;
  location: string;
  description: string;
  timestamp: string;
  estimatedClearTime: string;
  affectedRoutes: string[];
}

interface AlertModalProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark" | "light";
}

export function AlertModal({ alert, isOpen, onClose, theme = "dark" }: AlertModalProps) {
  if (!alert) return null;

  const Icon = alertIcons[alert.type];
  const isDark = theme === "dark";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-[500px]",
        isDark
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900"
      )}>
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              alert.severity === "high" ? "bg-red-500/20" :
              alert.severity === "medium" ? "bg-amber-500/20" : "bg-emerald-500/20"
            )}>
              <Icon className={cn(
                "w-6 h-6",
                alert.severity === "high" ? "text-red-400" :
                alert.severity === "medium" ? "text-amber-400" : "text-emerald-400"
              )} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={cn("text-xs", severityColors[alert.severity])}>
                  {alert.severity.toUpperCase()}
                </Badge>
                <span className={cn(
                  "text-xs",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  {formatTimeAgo(alert.timestamp)}
                </span>
              </div>
              <DialogTitle className={cn(
                "text-lg font-semibold",
                isDark ? "text-white" : "text-slate-900"
              )}>
                {alert.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <DialogDescription className={cn(
            "text-sm leading-relaxed",
            isDark ? "text-slate-300" : "text-slate-600"
          )}>
            {alert.description}
          </DialogDescription>

          {/* Details grid */}
          <div className={cn(
            "grid grid-cols-2 gap-4 p-4 rounded-lg",
            isDark ? "bg-slate-800/50" : "bg-slate-50"
          )}>
            <div className="flex items-center gap-2">
              <MapPin className={cn(
                "w-4 h-4",
                isDark ? "text-slate-400" : "text-slate-500"
              )} />
              <div>
                <p className={cn(
                  "text-xs",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  Location
                </p>
                <p className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white" : "text-slate-900"
                )}>
                  {alert.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className={cn(
                "w-4 h-4",
                isDark ? "text-slate-400" : "text-slate-500"
              )} />
              <div>
                <p className={cn(
                  "text-xs",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  Est. Clear Time
                </p>
                <p className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white" : "text-slate-900"
                )}>
                  {alert.estimatedClearTime}
                </p>
              </div>
            </div>
          </div>

          {/* Affected routes */}
          <div>
            <div className={cn(
              "flex items-center gap-2 mb-2",
              isDark ? "text-slate-400" : "text-slate-500"
            )}>
              <Route className="w-4 h-4" />
              <span className="text-sm font-medium">Affected Routes</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {alert.affectedRoutes.map((route) => (
                <span
                  key={route}
                  className={cn(
                    "px-2 py-1 rounded-md text-xs font-medium",
                    isDark
                      ? "bg-slate-800 text-slate-300"
                      : "bg-slate-100 text-slate-700"
                  )}
                >
                  {route}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onClose}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Acknowledge
            </Button>
            <Button
              variant="outline"
              className={cn(
                isDark
                  ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
