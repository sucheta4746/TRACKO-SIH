"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TrafficTrendData {
  time: string;
  vehicles: number;
  avgSpeed: number;
  congestion: number;
}

interface TrafficTrendsProps {
  data: TrafficTrendData[];
  theme?: "dark" | "light";
}

export function TrafficTrends({ data, theme = "dark" }: TrafficTrendsProps) {
  const isDark = theme === "dark";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
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
                {entry.value.toLocaleString()}
                {entry.name === "Avg Speed" ? " mph" : entry.name === "Congestion" ? "%" : ""}
              </span>
            </div>
          ))}
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
        <CardTitle className={cn(
          "text-lg font-semibold",
          isDark ? "text-white" : "text-slate-900"
        )}>
          Traffic Trends (24h)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#334155" : "#E2E8F0"}
                vertical={false}
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span className={isDark ? "text-slate-300" : "text-slate-700"}>
                    {value}
                  </span>
                )}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="vehicles"
                name="Vehicles"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#colorVehicles)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="congestion"
                name="Congestion"
                stroke="#EF4444"
                strokeWidth={2}
                fill="url(#colorCongestion)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
