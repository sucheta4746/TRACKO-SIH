// Smart Transport System - Mock Data

import { COLORS } from "./constants";

// Traffic KPI Data
export const trafficKPIs = [
  {
    id: "total-vehicles",
    title: "Active Vehicles",
    value: "12,847",
    change: "+5.2%",
    trend: "up" as const,
    icon: "car",
    details: {
      cars: 10234,
      buses: 1245,
      trucks: 1368,
    },
  },
  {
    id: "avg-speed",
    title: "Avg. Speed",
    value: "32 mph",
    change: "-2.1%",
    trend: "down" as const,
    icon: "gauge",
    details: {
      highways: "55 mph",
      mainRoads: "35 mph",
      localStreets: "22 mph",
    },
  },
  {
    id: "congestion",
    title: "Congestion Level",
    value: "42%",
    change: "+8.3%",
    trend: "up" as const,
    icon: "activity",
    details: {
      critical: 5,
      high: 12,
      moderate: 28,
    },
  },
  {
    id: "incidents",
    title: "Active Incidents",
    value: "7",
    change: "-3",
    trend: "down" as const,
    icon: "alert-triangle",
    details: {
      accidents: 3,
      roadwork: 2,
      events: 2,
    },
  },
];

// Traffic alerts
export const trafficAlerts = [
  {
    id: "alert-1",
    type: "accident" as const,
    severity: "high" as const,
    title: "Multi-vehicle accident on I-95 North",
    location: "I-95 North, Mile Marker 42",
    description: "3-vehicle collision blocking 2 lanes. Emergency services on scene. Expect delays of 25-30 minutes.",
    timestamp: "2026-09-16T12:15:00.000Z",
    estimatedClearTime: "45 minutes",
    affectedRoutes: ["I-95 N", "Exit 42A", "Exit 42B"],
  },
  {
    id: "alert-2",
    type: "congestion" as const,
    severity: "medium" as const,
    title: "Heavy traffic on Main Street Bridge",
    location: "Main Street Bridge, Downtown",
    description: "Rush hour congestion causing delays. Consider alternative routes via 2nd Avenue Bridge.",
    timestamp: "2026-09-16T12:00:00.000Z",
    estimatedClearTime: "1 hour",
    affectedRoutes: ["Main Street", "Bridge Rd", "Downtown Loop"],
  },
  {
    id: "alert-3",
    type: "roadwork" as const,
    severity: "low" as const,
    title: "Scheduled roadwork on Oak Avenue",
    location: "Oak Avenue, between 5th and 8th Street",
    description: "Lane closure for utility work. One lane open in each direction.",
    timestamp: "2026-09-16T10:30:00.000Z",
    estimatedClearTime: "6 hours",
    affectedRoutes: ["Oak Avenue"],
  },
  {
    id: "alert-4",
    type: "event" as const,
    severity: "medium" as const,
    title: "Stadium event causing traffic",
    location: "Stadium District",
    description: "Major sporting event ending at 10 PM. Expect heavy traffic in the stadium area.",
    timestamp: "2026-09-16T11:30:00.000Z",
    estimatedClearTime: "3 hours",
    affectedRoutes: ["Stadium Blvd", "Arena Way", "Parking Loop"],
  },
  {
    id: "alert-5",
    type: "weather" as const,
    severity: "high" as const,
    title: "Weather advisory: Heavy rain",
    location: "City-wide",
    description: "Heavy rain reducing visibility. Roads may be slippery. Drive with caution.",
    timestamp: "2026-09-16T11:45:00.000Z",
    estimatedClearTime: "2 hours",
    affectedRoutes: ["All routes"],
  },
];

// Intersections with traffic data
export const intersections = [
  { id: 1, name: "Main St & 1st Ave", lat: 40.7128, lng: -74.006, congestion: 75, avgWait: "45s" },
  { id: 2, name: "Broadway & 42nd St", lat: 40.7580, lng: -73.9855, congestion: 90, avgWait: "120s" },
  { id: 3, name: "5th Ave & 34th St", lat: 40.7484, lng: -73.9857, congestion: 65, avgWait: "35s" },
  { id: 4, name: "Park Ave & 57th St", lat: 40.7614, lng: -73.9718, congestion: 45, avgWait: "20s" },
  { id: 5, name: "Lexington & 86th St", lat: 40.7794, lng: -73.9545, congestion: 55, avgWait: "25s" },
  { id: 6, name: "Columbus & 72nd St", lat: 40.7769, lng: -73.9819, congestion: 40, avgWait: "15s" },
  { id: 7, name: "Houston & Lafayette", lat: 40.7258, lng: -73.9937, congestion: 82, avgWait: "90s" },
  { id: 8, name: "Canal & Centre St", lat: 40.7174, lng: -73.9996, congestion: 70, avgWait: "40s" },
];

// Vehicle positions for animation
export const vehicles: Array<{ id: string; type: "car" | "bus" | "truck"; lat: number; lng: number; speed: number; heading: number; route: string }> = [
  { id: "v1", type: "car", lat: 40.7128, lng: -74.006, speed: 35, heading: 45, route: "I-95 N" },
  { id: "v2", type: "bus", lat: 40.7580, lng: -73.9855, speed: 25, heading: 180, route: "Route 42" },
  { id: "v3", type: "truck", lat: 40.7484, lng: -73.9857, speed: 30, heading: 270, route: "Delivery" },
  { id: "v4", type: "car", lat: 40.7614, lng: -73.9718, speed: 40, heading: 90, route: "Local" },
  { id: "v5", type: "bus", lat: 40.7794, lng: -73.9545, speed: 20, heading: 135, route: "Route 86" },
  { id: "v6", type: "car", lat: 40.7769, lng: -73.9819, speed: 28, heading: 315, route: "Local" },
];

// Traffic trend data for charts
export const trafficTrendData = [
  { time: "00:00", vehicles: 1200, avgSpeed: 45, congestion: 15 },
  { time: "02:00", vehicles: 800, avgSpeed: 52, congestion: 8 },
  { time: "04:00", vehicles: 600, avgSpeed: 55, congestion: 5 },
  { time: "06:00", vehicles: 2500, avgSpeed: 38, congestion: 35 },
  { time: "08:00", vehicles: 8500, avgSpeed: 22, congestion: 75 },
  { time: "10:00", vehicles: 6200, avgSpeed: 30, congestion: 55 },
  { time: "12:00", vehicles: 7100, avgSpeed: 28, congestion: 62 },
  { time: "14:00", vehicles: 6800, avgSpeed: 30, congestion: 58 },
  { time: "16:00", vehicles: 8200, avgSpeed: 24, congestion: 72 },
  { time: "18:00", vehicles: 9100, avgSpeed: 20, congestion: 85 },
  { time: "20:00", vehicles: 5500, avgSpeed: 35, congestion: 42 },
  { time: "22:00", vehicles: 3200, avgSpeed: 42, congestion: 25 },
];

// Weekly traffic data
export const weeklyTrafficData = [
  { day: "Mon", avgCongestion: 68, peakHour: "8:00 AM", incidents: 12 },
  { day: "Tue", avgCongestion: 72, peakHour: "5:30 PM", incidents: 8 },
  { day: "Wed", avgCongestion: 65, peakHour: "8:15 AM", incidents: 15 },
  { day: "Thu", avgCongestion: 70, peakHour: "5:45 PM", incidents: 10 },
  { day: "Fri", avgCongestion: 78, peakHour: "4:30 PM", incidents: 18 },
  { day: "Sat", avgCongestion: 45, peakHour: "2:00 PM", incidents: 5 },
  { day: "Sun", avgCongestion: 35, peakHour: "12:00 PM", incidents: 3 },
];

// Route optimization suggestions
export const routeOptimizations = [
  {
    id: "opt-1",
    originalRoute: "I-95 North via Exit 42",
    suggestedRoute: "Route 1 via Greenville Ave",
    timeSaved: "12 min",
    distanceChange: "+2.3 mi",
    reason: "Accident on I-95",
    confidence: 94,
  },
  {
    id: "opt-2",
    originalRoute: "Main Street Bridge",
    suggestedRoute: "2nd Avenue Bridge",
    timeSaved: "8 min",
    distanceChange: "+0.5 mi",
    reason: "Rush hour congestion",
    confidence: 87,
  },
  {
    id: "opt-3",
    originalRoute: "Downtown via Center St",
    suggestedRoute: "Downtown via Market St",
    timeSaved: "5 min",
    distanceChange: "-0.2 mi",
    reason: "Roadwork on Center St",
    confidence: 91,
  },
];

// School bus data
export const schoolBuses = [
  {
    id: "bus-101",
    routeNumber: "101",
    driverName: "John Smith",
    currentLocation: { lat: 40.7328, lng: -73.996 },
    nextStop: "Lincoln Elementary",
    eta: "5 min",
    studentsOnboard: 18,
    totalCapacity: 40,
    status: "on-route" as const,
    speed: 25,
  },
  {
    id: "bus-102",
    routeNumber: "102",
    driverName: "Maria Garcia",
    currentLocation: { lat: 40.7450, lng: -73.988 },
    nextStop: "Washington Middle School",
    eta: "12 min",
    studentsOnboard: 32,
    totalCapacity: 40,
    status: "on-route" as const,
    speed: 30,
  },
  {
    id: "bus-103",
    routeNumber: "103",
    driverName: "Robert Johnson",
    currentLocation: { lat: 40.7580, lng: -73.970 },
    nextStop: "Jefferson High School",
    eta: "8 min",
    studentsOnboard: 25,
    totalCapacity: 45,
    status: "delayed" as const,
    speed: 15,
    delayReason: "Traffic on 5th Avenue",
  },
];

// Student pickup status
export const studentPickupStatus = [
  { id: "s1", name: "Emma Wilson", school: "Lincoln Elementary", busId: "bus-101", status: "onboard" as const, pickupTime: "7:35 AM" },
  { id: "s2", name: "James Wilson", school: "Washington Middle", busId: "bus-102", status: "waiting" as const, pickupTime: "7:50 AM" },
];

// Delay prediction data
export const delayPredictions = [
  { route: "I-95 N", currentDelay: 15, predictedDelay: 22, trend: "increasing" as const },
  { route: "Main St Bridge", currentDelay: 8, predictedDelay: 5, trend: "decreasing" as const },
  { route: "Highway 101", currentDelay: 0, predictedDelay: 12, trend: "increasing" as const },
  { route: "Downtown Loop", currentDelay: 5, predictedDelay: 5, trend: "stable" as const },
];

// System reports
export const systemReports = [
  {
    id: "report-1",
    title: "Daily Traffic Summary",
    type: "daily" as const,
    date: "2026-09-16",
    status: "ready" as const,
    metrics: {
      totalVehicles: 245678,
      avgCongestion: 52,
      incidents: 23,
      avgResponseTime: "4.2 min",
    },
  },
  {
    id: "report-2",
    title: "Weekly Performance Report",
    type: "weekly" as const,
    date: "2026-09-09",
    status: "ready" as const,
    metrics: {
      totalVehicles: 1567890,
      avgCongestion: 48,
      incidents: 156,
      avgResponseTime: "4.5 min",
    },
  },
  {
    id: "report-3",
    title: "Monthly Analytics Report",
    type: "monthly" as const,
    date: "2026-08-17",
    status: "processing" as const,
    metrics: {
      totalVehicles: 6234567,
      avgCongestion: 45,
      incidents: 612,
      avgResponseTime: "4.3 min",
    },
  },
];

// Get congestion color based on level
export function getCongestionColor(level: number): string {
  if (level < 20) return COLORS.traffic.free;
  if (level < 40) return COLORS.traffic.light;
  if (level < 60) return COLORS.traffic.moderate;
  if (level < 80) return COLORS.traffic.heavy;
  return COLORS.traffic.severe;
}

// Get congestion label
export function getCongestionLabel(level: number): string {
  if (level < 20) return "Free Flow";
  if (level < 40) return "Light Traffic";
  if (level < 60) return "Moderate";
  if (level < 80) return "Heavy";
  return "Severe";
}

// Format time ago
export function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
