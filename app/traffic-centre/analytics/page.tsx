"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TrafficTrends } from "@/components/charts/TrafficTrends";
import { DelayPrediction } from "@/components/charts/DelayPrediction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  trafficTrendData,
  weeklyTrafficData,
  delayPredictions,
} from "@/lib/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Clock,
  Car,
  AlertTriangle,
} from "lucide-react";
import { AuthorityAnalytics } from "@/components/shared/AuthorityAnalytics";

const incidentTypeData = [
  { name: "Accidents", value: 35, color: "#EF4444" },
  { name: "Congestion", value: 28, color: "#F97316" },
  { name: "Roadwork", value: 20, color: "#FACC15" },
  { name: "Events", value: 12, color: "#3B82F6" },
  { name: "Weather", value: 5, color: "#8B5CF6" },
];

const hourlyIncidents = [
  { hour: "6AM", incidents: 3 },
  { hour: "8AM", incidents: 12 },
  { hour: "10AM", incidents: 8 },
  { hour: "12PM", incidents: 6 },
  { hour: "2PM", incidents: 7 },
  { hour: "4PM", incidents: 15 },
  { hour: "6PM", incidents: 18 },
  { hour: "8PM", incidents: 9 },
  { hour: "10PM", incidents: 4 },
];

const responseTimeData = [
  { day: "Mon", avgTime: 4.2, target: 5 },
  { day: "Tue", avgTime: 3.8, target: 5 },
  { day: "Wed", avgTime: 5.1, target: 5 },
  { day: "Thu", avgTime: 4.5, target: 5 },
  { day: "Fri", avgTime: 4.8, target: 5 },
  { day: "Sat", avgTime: 3.2, target: 5 },
  { day: "Sun", avgTime: 2.9, target: 5 },
];

function LegacyAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("24h");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-white mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-400">{entry.name}:</span>
              <span className="font-medium text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] p-4 lg:p-6">
      {/* Header */}
      <header className="mb-6 pt-12 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
              Traffic Analytics
            </h1>
            <p className="text-slate-400">
              In-depth analysis of traffic patterns and system performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
              {["24h", "7d", "30d", "90d"].map((range) => (
                <Button
                  key={range}
                  variant="ghost"
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-3",
                    timeRange === range
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-slate-400 hover:text-white hover:bg-slate-700"
                  )}
                >
                  {range}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: "Total Traffic Volume",
            value: "245,678",
            change: "+12.5%",
            trend: "up" as const,
            icon: Car,
          },
          {
            title: "Avg. Response Time",
            value: "4.2 min",
            change: "-8.3%",
            trend: "down" as const,
            icon: Clock,
          },
          {
            title: "Incidents Resolved",
            value: "156",
            change: "+5.2%",
            trend: "up" as const,
            icon: AlertTriangle,
          },
          {
            title: "Peak Congestion",
            value: "78%",
            change: "-3.1%",
            trend: "down" as const,
            icon: TrendingUp,
          },
        ].map((stat, index) => (
          <Card
            key={stat.title}
            className="bg-slate-900/50 border-slate-800 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    stat.title.includes("Response") || stat.title.includes("Peak")
                      ? stat.trend === "down"
                        ? "text-emerald-500"
                        : "text-red-500"
                      : stat.trend === "up"
                      ? "text-emerald-500"
                      : "text-red-500"
                  )}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="animate-slide-up animation-delay-200">
          <TrafficTrends data={trafficTrendData} theme="dark" />
        </div>
        <div className="animate-slide-up animation-delay-300">
          <DelayPrediction data={delayPredictions} theme="dark" />
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Performance */}
        <Card className="bg-slate-900/50 border-slate-800 animate-slide-up animation-delay-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="avgCongestion"
                    name="Avg. Congestion"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Incident Distribution */}
        <Card className="bg-slate-900/50 border-slate-800 animate-slide-up animation-delay-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-white">
              Incident Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {incidentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {incidentTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-slate-400">{item.name}</span>
                  <span className="text-xs font-medium text-white ml-auto">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Time Trend */}
        <Card className="bg-slate-900/50 border-slate-800 animate-slide-up animation-delay-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              Response Time Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                    tickFormatter={(value) => `${value}m`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="avgTime"
                    name="Avg. Time"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={{ fill: "#22C55E", strokeWidth: 0, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Target"
                    stroke="#EF4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-emerald-500 rounded" />
                <span className="text-xs text-slate-400">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-500 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #EF4444 0px, #EF4444 3px, transparent 3px, transparent 6px)' }} />
                <span className="text-xs text-slate-400">Target (5 min)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AuthorityAnalytics;
