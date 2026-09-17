// Smart Transport System - Constants and Configuration

export const COLORS = {
  // Primary palette
  primary: {
    blue: "#2563EB",
    blueDark: "#1D4ED8",
    blueLight: "#3B82F6",
  },
  // Status colors
  status: {
    success: "#22C55E",
    warning: "#FACC15",
    error: "#EF4444",
    info: "#3B82F6",
  },
  // Background colors
  background: {
    dark: "#0F172A",
    darkSecondary: "#1E293B",
    darkTertiary: "#334155",
    light: "#FFFFFF",
    lightSecondary: "#F8FAFC",
    lightTertiary: "#F1F5F9",
  },
  // Text colors
  text: {
    dark: "#1E293B",
    darkMuted: "#64748B",
    light: "#F1F5F9",
    lightMuted: "#94A3B8",
  },
  // Traffic condition colors
  traffic: {
    free: "#22C55E",
    light: "#84CC16",
    moderate: "#FACC15",
    heavy: "#F97316",
    severe: "#EF4444",
  },
  // Chart colors
  chart: {
    blue: "#3B82F6",
    green: "#22C55E",
    yellow: "#FACC15",
    orange: "#F97316",
    red: "#EF4444",
    purple: "#8B5CF6",
  },
} as const;

export const ROLES = {
  trafficCentre: {
    id: "traffic-centre",
    name: "Traffic Centre",
    description: "Monitor traffic, analyze patterns, and manage city-wide transportation",
    icon: "activity",
    path: "/traffic-centre/dashboard",
    theme: "dark",
    features: ["Real-time monitoring", "Analytics", "Alerts", "AI Optimization"],
  },
  driver: {
    id: "driver",
    name: "Driver",
    description: "Navigate efficiently with real-time traffic updates and route optimization",
    icon: "car",
    path: "/driver/dashboard",
    theme: "light",
    features: ["Turn-by-turn navigation", "Live traffic", "Route optimization"],
  },
  citizen: {
    id: "citizen",
    name: "Citizen",
    description: "Plan your journey with accurate traffic information and ETA predictions",
    icon: "users",
    path: "/citizen/dashboard",
    theme: "light",
    features: ["Route search", "Traffic info", "ETA predictions"],
  },
  studentParent: {
    id: "student-parent",
    name: "Student Parent",
    description: "Track school buses in real-time and receive pickup notifications",
    icon: "bus",
    path: "/student-parent/dashboard",
    theme: "light",
    features: ["Live bus tracking", "Pickup status", "Arrival alerts"],
  },
} as const;

export const NAV_ITEMS = {
  trafficCentre: [
    { name: "Dashboard", path: "/traffic-centre/dashboard", icon: "layout-dashboard" },
    { name: "AI Mobility Sensing", path: "/ai-sensing", icon: "zap" },
    { name: "Analytics", path: "/traffic-centre/analytics", icon: "bar-chart-3" },
    { name: "Alerts", path: "/traffic-centre/alerts", icon: "bell" },
    { name: "Reports", path: "/traffic-centre/reports", icon: "file-text" },
  ],
  driver: [
    { name: "Navigation", path: "/driver/dashboard", icon: "navigation" },
  ],
  citizen: [
    { name: "Live City Overview", path: "/citizen/dashboard", icon: "layout-dashboard" },
    { name: "Issues Near You", path: "/citizen/issues", icon: "search" },
    { name: "AI Area Report", path: "/citizen/ai-report", icon: "zap" },
    { name: "Report a Problem", path: "/citizen/report", icon: "file-text" },
    { name: "Track Complaints", path: "/citizen/complaints", icon: "clock" },
    { name: "Live Transit & Hazards", path: "/citizen/transit", icon: "bus" },
  ],
  studentParent: [
    { name: "Bus Tracking", path: "/student-parent/dashboard", icon: "bus" },
  ],
} as const;

export const MAP_CONFIG = {
  defaultCenter: { lat: 40.7128, lng: -74.006 }, // New York City
  defaultZoom: 12,
  trafficLayerZoom: 10,
} as const;

export const REFRESH_INTERVALS = {
  trafficData: 30000, // 30 seconds
  vehiclePosition: 5000, // 5 seconds
  alerts: 15000, // 15 seconds
  analytics: 60000, // 1 minute
} as const;

export const TRAFFIC_THRESHOLDS = {
  free: { min: 0, max: 20 },
  light: { min: 21, max: 40 },
  moderate: { min: 41, max: 60 },
  heavy: { min: 61, max: 80 },
  severe: { min: 81, max: 100 },
} as const;

export type Role = keyof typeof ROLES;
export type TrafficCondition = keyof typeof COLORS.traffic;
