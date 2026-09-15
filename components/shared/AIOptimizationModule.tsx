"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  TrendingDown,
  Route,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface RouteOptimization {
  id: string;
  originalRoute: string;
  suggestedRoute: string;
  timeSaved: string;
  distanceChange: string;
  reason: string;
  confidence: number;
}

interface AIOptimizationModuleProps {
  optimizations: RouteOptimization[];
  theme?: "dark" | "light";
}

export function AIOptimizationModule({ optimizations, theme = "dark" }: AIOptimizationModuleProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [appliedOptimizations, setAppliedOptimizations] = useState<string[]>([]);
  const isDark = theme === "dark";

  const handleOptimize = async () => {
    setIsOptimizing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsOptimizing(false);
  };

  const handleApplyOptimization = (id: string) => {
    setAppliedOptimizations(prev => [...prev, id]);
  };

  return (
    <Card className={cn(
      "overflow-hidden",
      isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              "bg-gradient-to-br from-blue-500 to-purple-600"
            )}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className={cn(
                "text-lg font-semibold",
                isDark ? "text-white" : "text-slate-900"
              )}>
                AI Route Optimization
              </CardTitle>
              <p className={cn(
                "text-sm",
                isDark ? "text-slate-400" : "text-slate-500"
              )}>
                Smart route suggestions based on real-time traffic
              </p>
            </div>
          </div>
          <Button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Optimization
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Optimization status bar */}
        {isOptimizing && (
          <div className={cn(
            "mb-4 p-3 rounded-lg",
            isDark ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-50 border border-blue-100"
          )}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className={cn(
                "text-sm font-medium",
                isDark ? "text-blue-400" : "text-blue-600"
              )}>
                AI is analyzing traffic patterns...
              </span>
            </div>
            <div className={cn(
              "h-1.5 rounded-full overflow-hidden",
              isDark ? "bg-slate-800" : "bg-blue-100"
            )}>
              <div className="h-full bg-blue-500 animate-gradient-shift rounded-full w-3/4" />
            </div>
          </div>
        )}

        {/* Optimizations list */}
        <div className="space-y-3">
          {optimizations.map((opt) => {
            const isApplied = appliedOptimizations.includes(opt.id);
            
            return (
              <div
                key={opt.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-300",
                  isApplied
                    ? isDark
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-emerald-50 border-emerald-200"
                    : isDark
                    ? "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Routes comparison */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={cn(
                        "text-sm font-medium line-through opacity-60",
                        isDark ? "text-slate-400" : "text-slate-500"
                      )}>
                        {opt.originalRoute}
                      </span>
                      <ArrowRight className={cn(
                        "w-4 h-4 flex-shrink-0",
                        isDark ? "text-slate-500" : "text-slate-400"
                      )} />
                      <span className={cn(
                        "text-sm font-semibold",
                        isDark ? "text-white" : "text-slate-900"
                      )}>
                        {opt.suggestedRoute}
                      </span>
                    </div>

                    {/* Reason */}
                    <p className={cn(
                      "text-xs mb-3",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}>
                      {opt.reason}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-500">
                          -{opt.timeSaved}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Route className={cn(
                          "w-3.5 h-3.5",
                          isDark ? "text-slate-400" : "text-slate-500"
                        )} />
                        <span className={cn(
                          "text-xs",
                          isDark ? "text-slate-400" : "text-slate-500"
                        )}>
                          {opt.distanceChange}
                        </span>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        opt.confidence >= 90
                          ? "border-emerald-500/30 text-emerald-400"
                          : opt.confidence >= 80
                          ? "border-amber-500/30 text-amber-400"
                          : "border-slate-500/30 text-slate-400"
                      )}>
                        {opt.confidence}% confidence
                      </Badge>
                    </div>
                  </div>

                  {/* Apply button */}
                  <Button
                    size="sm"
                    variant={isApplied ? "ghost" : "default"}
                    disabled={isApplied}
                    onClick={() => handleApplyOptimization(opt.id)}
                    className={cn(
                      "flex-shrink-0",
                      isApplied
                        ? "text-emerald-500"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Applied
                      </>
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary stats */}
        <div className={cn(
          "mt-4 p-3 rounded-lg flex items-center justify-between",
          isDark ? "bg-slate-800/50" : "bg-slate-50"
        )}>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-500" />
            <span className={cn(
              "text-sm",
              isDark ? "text-slate-300" : "text-slate-700"
            )}>
              Potential time saved:
            </span>
          </div>
          <span className="text-sm font-bold text-emerald-500">
            ~25 minutes across all routes
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
