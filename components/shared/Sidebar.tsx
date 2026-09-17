"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Bell,
  FileText,
  Navigation,
  Search,
  Bus,
  Home,
  Menu,
  X,
  Radio,
  Zap,
  Settings,
  LogOut,
  ChevronLeft,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  "bar-chart-3": BarChart3,
  bell: Bell,
  "file-text": FileText,
  navigation: Navigation,
  search: Search,
  bus: Bus,
  zap: Zap,
  clock: Clock3,
};

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

interface SidebarProps {
  navItems: readonly NavItem[];
  roleId: string;
  roleName: string;
  theme?: "dark" | "light";
}

export function Sidebar({ navItems, roleId, roleName, theme = "dark" }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isDark = theme === "dark";

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed top-4 left-4 z-50 lg:hidden",
          isDark ? "text-white hover:bg-slate-800" : "text-slate-900 hover:bg-slate-100"
        )}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full transition-all duration-300 ease-in-out",
          "flex flex-col border-r",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isDark
            ? "bg-[#0f1629] border-slate-800"
            : "bg-white border-slate-200"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center gap-3 px-6 py-5 border-b",
          isDark ? "border-slate-800" : "border-slate-200"
        )}>
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className={cn(
                "text-lg font-bold tracking-tight truncate",
                isDark ? "text-white" : "text-slate-900"
              )}>
                TRACKO
              </h1>
              <p className={cn(
                "text-xs truncate",
                isDark ? "text-slate-400" : "text-slate-500"
              )}>
                {roleName}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard;
            const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(`${item.path}/`));

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "group relative",
                  isCollapsed && "justify-center",
                  isActive
                    ? isDark
                      ? "bg-blue-600/20 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                    : isDark
                    ? "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {isActive && (
                  <div className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full",
                    "bg-blue-500"
                  )} />
                )}
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform",
                  isActive && "scale-110"
                )} />
                {!isCollapsed && (
                  <span className="font-medium truncate">{item.name}</span>
                )}
                {isCollapsed && (
                  <div className={cn(
                    "absolute left-full ml-2 px-2 py-1 rounded-md text-sm whitespace-nowrap",
                    "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
                    "transition-all duration-200 z-50",
                    isDark
                      ? "bg-slate-800 text-white"
                      : "bg-slate-900 text-white"
                  )}>
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={cn(
          "px-3 py-4 border-t space-y-1",
          isDark ? "border-slate-800" : "border-slate-200"
        )}>
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              isCollapsed && "justify-center",
              isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Back to Home</span>}
          </Link>
          
          {/* Collapse button - desktop only */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "w-full justify-center lg:flex hidden",
              isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <ChevronLeft className={cn(
              "w-5 h-5 transition-transform duration-300",
              isCollapsed && "rotate-180"
            )} />
          </Button>
        </div>
      </aside>

      {/* Spacer for main content */}
      <div className={cn(
        "hidden lg:block flex-shrink-0 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )} />
    </>
  );
}
