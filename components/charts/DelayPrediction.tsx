"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DelayData {
  route: string;
  currentDelay: number;
  predictedDelay: number;
  trend: "increasing" | "decreasing" | "stable";
}

interface DelayPredictionProps {
  data: DelayData[];
  theme?: "dark" | "light";
}

const trendIcons = {
  increasing: TrendingUp,
  decreasing: TrendingDown,
  stable: Minus,
};

const trendColors = {
  increasing: "text-red-400",
  decreasing: "text-emerald-400",
  stable: "text-amber-400",
};

export function DelayPrediction({ data, theme = "dark" }: DelayPredictionProps) {
  const isDark = theme === "dark";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const routeData = data.find(d => d.route === label);
      const TrendIcon = routeData ? trendIcons[routeData.trend] : Minus;
      
      return (
        <div className={cn(
          "p-3 rounded-lg shadow-lg border",
          isDark
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-slate-200"
        )}>
          <p className={cn(
            "text-sm font-medium mb-2",
            isDark ? "text-white" : "text-slate-900"
          )}>
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                {entry.name}:
              </span>
              <span className={cn(
                "font-medium",
                isDark ? "text-white" : "text-slate-900"
              )}>
                {entry.value} min
              </span>
            </div>
          ))}
          {routeData && (
            <div className={cn(
              "flex items-center gap-1 mt-2 pt-2 border-t text-sm",
              isDark ? "border-slate-700" : "border-slate-200"
            )}>
              <TrendIcon className={cn("w-3.5 h-3.5", trendColors[routeData.trend])} />
              <span className={cn("capitalize", trendColors[routeData.trend])}>
                {routeData.trend}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

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
            Delay Predictions
          </CardTitle>
          <div className="flex items-center gap-4">
            {[
              { color: "#3B82F6", label: "Current" },
              { color: "#8B5CF6", label: "Predicted" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: color }}
                />
                <span className={cn(
                  "text-xs",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#334155" : "#E2E8F0"}
                vertical={false}
              />
              <XAxis
                dataKey="route"
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 11 }}
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 12 }}
                tickFormatter={(value) => `${value}m`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? "#1E293B" : "#F1F5F9" }} />
              <Bar
                dataKey="currentDelay"
                name="Current Delay"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="predictedDelay"
                name="Predicted Delay"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.trend === "increasing"
                        ? "#EF4444"
                        : entry.trend === "decreasing"
                        ? "#22C55E"
                        : "#8B5CF6"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend summary */}
        <div className={cn(
          "mt-4 grid grid-cols-3 gap-3",
          isDark ? "text-slate-400" : "text-slate-500"
        )}>
          {[
            { trend: "increasing" as const, label: "Increasing", count: data.filter(d => d.trend === "increasing").length },
            { trend: "stable" as const, label: "Stable", count: data.filter(d => d.trend === "stable").length },
            { trend: "decreasing" as const, label: "Decreasing", count: data.filter(d => d.trend === "decreasing").length },
          ].map(({ trend, label, count }) => {
            const Icon = trendIcons[trend];
            return (
              <div
                key={trend}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg",
                  isDark ? "bg-slate-800/50" : "bg-slate-50"
                )}
              >
                <Icon className={cn("w-4 h-4", trendColors[trend])} />
                <div>
                  <p className="text-xs">{label}</p>
                  <p className={cn(
                    "text-sm font-semibold",
                    isDark ? "text-white" : "text-slate-900"
                  )}>
                    {count} routes
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
