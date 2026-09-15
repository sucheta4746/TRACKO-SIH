"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Car,
  Gauge,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const iconMap = {
  car: Car,
  gauge: Gauge,
  activity: Activity,
  "alert-triangle": AlertTriangle,
};

interface KPICardProps {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
  details?: Record<string, string | number | undefined>;
  theme?: "dark" | "light";
}

export function KPICard({
  id,
  title,
  value,
  change,
  trend,
  icon,
  details,
  theme = "dark",
}: KPICardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = iconMap[icon as keyof typeof iconMap] || Activity;
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const isDark = theme === "dark";

  const isPositiveTrend = 
    (id === "avg-speed" && trend === "down") ||
    (id === "congestion" && trend === "down") ||
    (id === "incidents" && trend === "down") ||
    (id === "total-vehicles" && trend === "up");

  return (
    <Card
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-xl",
        isDark
          ? "bg-slate-900/50 border-slate-800 hover:border-slate-700"
          : "bg-white border-slate-200 hover:border-slate-300",
        isExpanded && "ring-2 ring-blue-500/50"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Accent gradient */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        "bg-gradient-to-br from-blue-500/5 to-transparent"
      )} />

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            isDark ? "bg-slate-800" : "bg-slate-100"
          )}>
            <Icon className={cn(
              "w-5 h-5",
              isDark ? "text-blue-400" : "text-blue-600"
            )} />
          </div>
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform duration-300",
            isDark ? "text-slate-500" : "text-slate-400",
            isExpanded && "rotate-180"
          )} />
        </div>
        <CardTitle className={cn(
          "text-sm font-medium mt-3",
          isDark ? "text-slate-400" : "text-slate-500"
        )}>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-end justify-between">
          <span className={cn(
            "text-2xl font-bold",
            isDark ? "text-white" : "text-slate-900"
          )}>
            {value}
          </span>
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            isPositiveTrend ? "text-emerald-500" : "text-red-500"
          )}>
            <TrendIcon className="w-4 h-4" />
            <span>{change}</span>
          </div>
        </div>

        {/* Expanded details */}
        <div className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-40 mt-4 pt-4 border-t" : "max-h-0",
          isDark ? "border-slate-800" : "border-slate-200"
        )}>
          {details && (
            <div className="space-y-2">
              {Object.entries(details).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className={cn(
                    "capitalize",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={cn(
                    "font-medium",
                    isDark ? "text-white" : "text-slate-900"
                  )}>
                    {typeof val === 'number' ? val.toLocaleString() : val}
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
