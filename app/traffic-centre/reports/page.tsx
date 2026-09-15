"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { systemReports } from "@/lib/mockData";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  Filter,
  Plus,
  Search,
  BarChart3,
  TrendingUp,
  Car,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Eye,
} from "lucide-react";

const reportTypeIcons = {
  daily: Clock,
  weekly: Calendar,
  monthly: BarChart3,
};

const reportTypeColors = {
  daily: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  weekly: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  monthly: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const handleGenerateReport = async (reportId: string) => {
    setGeneratingReport(reportId);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGeneratingReport(null);
  };

  const filteredReports = systemReports.filter((report) =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0f1a] p-4 lg:p-6">
      {/* Header */}
      <header className="mb-6 pt-12 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              Reports & Analytics
            </h1>
            <p className="text-slate-400">
              Generate, view, and download traffic system reports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Generate New Report
            </Button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Reports Generated", value: "156", icon: FileText, trend: "+12 this week" },
          { label: "Avg. Processing Time", value: "2.3s", icon: Clock, trend: "-15% faster" },
          { label: "Total Downloads", value: "1,234", icon: Download, trend: "+45 today" },
          { label: "Scheduled Reports", value: "8", icon: Calendar, trend: "Next: 6:00 AM" },
        ].map((stat, index) => (
          <Card
            key={stat.label}
            className="bg-slate-900/50 border-slate-800 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500"
          />
        </div>
        <Button
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Report Templates */}
      <Card className="bg-slate-900/50 border-slate-800 mb-6 animate-slide-up animation-delay-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white">
            Quick Report Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Traffic Summary", icon: Car, description: "Overview of traffic flow and congestion" },
              { name: "Incident Analysis", icon: AlertTriangle, description: "Detailed incident breakdown" },
              { name: "Performance Metrics", icon: TrendingUp, description: "System performance stats" },
              { name: "Custom Report", icon: FileText, description: "Build your own report" },
            ].map((template) => (
              <button
                key={template.name}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200 text-left",
                  "bg-slate-800/50 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800"
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                  <template.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="font-medium text-white mb-1">{template.name}</h4>
                <p className="text-xs text-slate-400">{template.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="bg-slate-900/50 border-slate-800 animate-slide-up animation-delay-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">
              Recent Reports
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredReports.map((report, index) => {
            const TypeIcon = reportTypeIcons[report.type];
            const isGenerating = generatingReport === report.id;

            return (
              <div
                key={report.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200",
                  "bg-slate-800/30 border-slate-700 hover:border-slate-600"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        report.type === "daily"
                          ? "bg-blue-500/20"
                          : report.type === "weekly"
                          ? "bg-emerald-500/20"
                          : "bg-purple-500/20"
                      )}
                    >
                      <TypeIcon
                        className={cn(
                          "w-6 h-6",
                          report.type === "daily"
                            ? "text-blue-400"
                            : report.type === "weekly"
                            ? "text-emerald-400"
                            : "text-purple-400"
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{report.title}</h4>
                        <Badge className={reportTypeColors[report.type]}>
                          {report.type}
                        </Badge>
                        {report.status === "processing" ? (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Processing
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Ready
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mb-3">
                        Generated: {new Date(report.date).toLocaleDateString()}
                      </p>

                      {/* Report metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Total Vehicles</p>
                          <p className="text-sm font-medium text-white">
                            {report.metrics.totalVehicles.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Avg. Congestion</p>
                          <p className="text-sm font-medium text-white">
                            {report.metrics.avgCongestion}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Incidents</p>
                          <p className="text-sm font-medium text-white">
                            {report.metrics.incidents}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Avg. Response</p>
                          <p className="text-sm font-medium text-white">
                            {report.metrics.avgResponseTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      disabled={report.status === "processing" || isGenerating}
                      onClick={() => handleGenerateReport(report.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
