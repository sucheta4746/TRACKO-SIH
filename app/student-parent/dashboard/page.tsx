"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GoogleMap } from "@/components/shared/GoogleMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Bus,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Bell,
  User,
  CheckCircle2,
  Circle,
  Navigation,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  School,
  Home,
  Coffee,
} from "lucide-react";

// Simulated bus data
const busData = {
  id: "BUS-42",
  driver: "John Smith",
  driverPhone: "+1 (555) 123-4567",
  currentLocation: { lat: 40.7282, lng: -73.9942 },
  speed: 25,
  capacity: 45,
  currentPassengers: 32,
  status: "en_route",
  nextStop: "Oak Street & 5th Ave",
  estimatedArrival: "8 min",
  routeProgress: 65,
  stops: [
    { id: 1, name: "School Departure", time: "7:00 AM", status: "completed", passengers: 0 },
    { id: 2, name: "Main Street Stop", time: "7:12 AM", status: "completed", passengers: 8 },
    { id: 3, name: "Park Avenue Stop", time: "7:24 AM", status: "completed", passengers: 15 },
    { id: 4, name: "Oak Street & 5th Ave", time: "7:38 AM", status: "current", passengers: 24 },
    { id: 5, name: "Riverside Drive", time: "7:50 AM", status: "upcoming", passengers: 32 },
    { id: 6, name: "Your Location", time: "8:02 AM", status: "upcoming", passengers: 35 },
  ],
};

// Children data
const children = [
  {
    id: 1,
    name: "Emma Johnson",
    grade: "5th Grade",
    avatar: "",
    busId: "BUS-42",
    pickupStatus: "waiting",
    school: "Lincoln Elementary",
  },
  {
    id: 2,
    name: "Liam Johnson",
    grade: "3rd Grade",
    avatar: "",
    busId: "BUS-42",
    pickupStatus: "waiting",
    school: "Lincoln Elementary",
  },
];

// Notifications
const notifications = [
  { id: 1, message: "Bus 42 departed from school on time", time: "7:00 AM", type: "info" },
  { id: 2, message: "Minor traffic delay on Main Street (+3 min)", time: "7:15 AM", type: "warning" },
  { id: 3, message: "Bus is now 3 stops away from your location", time: "7:35 AM", type: "info" },
];

export default function StudentParentDashboard() {
  const [selectedChild, setSelectedChild] = useState(children[0]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Map markers
  const mapMarkers = [
    {
      id: "bus",
      lat: busData.currentLocation.lat,
      lng: busData.currentLocation.lng,
      type: "vehicle" as const,
      label: `Bus ${busData.id}`,
      status: `${busData.speed} mph`,
    },
    {
      id: "home",
      lat: 40.7489,
      lng: -73.9680,
      type: "intersection" as const,
      label: "Your Location",
      congestion: 10,
    },
    {
      id: "school",
      lat: 40.7128,
      lng: -74.0060,
      type: "intersection" as const,
      label: "Lincoln Elementary",
      congestion: 20,
    },
  ];

  const getStopIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "current":
        return <Navigation className="w-5 h-5 text-amber-500 animate-pulse" />;
      default:
        return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-6">
      {/* Status Banner */}
      <div className="bg-amber-500 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bus className="w-6 h-6" />
            <div>
              <p className="font-semibold">Bus {busData.id} is on the way!</p>
              <p className="text-sm text-amber-100">
                Arriving in approximately {busData.estimatedArrival}
              </p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-0">
            {busData.routeProgress}% complete
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Children Cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={cn(
                "flex-shrink-0 flex items-center gap-3 p-3 rounded-xl border-2 transition-all min-w-[200px]",
                selectedChild.id === child.id
                  ? "bg-amber-50 border-amber-500"
                  : "bg-white border-slate-200 hover:border-amber-300"
              )}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={child.avatar} />
                <AvatarFallback className="bg-amber-100 text-amber-700">
                  {child.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-semibold text-slate-900">{child.name}</p>
                <p className="text-sm text-slate-500">{child.grade}</p>
                <Badge
                  className={cn(
                    "text-xs mt-1",
                    child.pickupStatus === "picked_up"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  )}
                >
                  {child.pickupStatus === "picked_up" ? "Picked Up" : "Waiting"}
                </Badge>
              </div>
            </button>
          ))}
        </div>

        {/* Main ETA Card */}
        <Card className="bg-white border-slate-200 shadow-sm animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Estimated Arrival</p>
                <p className="text-4xl font-bold text-slate-900">
                  {busData.estimatedArrival}
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
                <Bus className="w-8 h-8 text-amber-600" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Route Progress</span>
                <span className="font-medium text-slate-900">
                  {busData.routeProgress}%
                </span>
              </div>
              <Progress value={busData.routeProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Next Stop</p>
                  <p className="text-sm font-medium text-slate-900">
                    {busData.nextStop}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Students on Bus</p>
                  <p className="text-sm font-medium text-slate-900">
                    {busData.currentPassengers}/{busData.capacity}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Map */}
        <div className="animate-slide-up animation-delay-100">
          <GoogleMap
            markers={mapMarkers}
            showTrafficLayer={false}
            height="200px"
            theme="light"
            showRoute={true}
          />
        </div>

        {/* Route Stops */}
        <Card className="bg-white border-slate-200 shadow-sm animate-slide-up animation-delay-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-amber-500" />
              Route Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {busData.stops.map((stop, index) => (
                <div key={stop.id} className="flex gap-4 pb-4 last:pb-0">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    {getStopIcon(stop.status)}
                    {index < busData.stops.length - 1 && (
                      <div
                        className={cn(
                          "w-0.5 flex-1 my-1",
                          stop.status === "completed"
                            ? "bg-emerald-300"
                            : "bg-slate-200"
                        )}
                      />
                    )}
                  </div>

                  {/* Stop info */}
                  <div
                    className={cn(
                      "flex-1 pb-4",
                      stop.status === "current" && "bg-amber-50 -mx-2 px-2 py-2 rounded-lg"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p
                        className={cn(
                          "font-medium",
                          stop.status === "completed"
                            ? "text-slate-500"
                            : stop.status === "current"
                            ? "text-amber-900"
                            : "text-slate-900"
                        )}
                      >
                        {stop.name}
                        {stop.name === "Your Location" && (
                          <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">
                            <Home className="w-3 h-3 mr-1" />
                            You
                          </Badge>
                        )}
                      </p>
                      <span
                        className={cn(
                          "text-sm",
                          stop.status === "completed"
                            ? "text-slate-400"
                            : stop.status === "current"
                            ? "text-amber-700 font-medium"
                            : "text-slate-500"
                        )}
                      >
                        {stop.time}
                      </span>
                    </div>
                    {stop.status === "current" && (
                      <p className="text-sm text-amber-600 mt-1">
                        Bus is currently here
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Driver Contact */}
        <Card className="bg-white border-slate-200 shadow-sm animate-slide-up animation-delay-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Bus Driver
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-slate-200 text-slate-700">
                    {busData.driver.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-900">{busData.driver}</p>
                  <p className="text-sm text-slate-500">Bus {busData.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 border-slate-300 text-slate-700"
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  className="h-10 w-10 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Phone className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="bg-white border-slate-200 shadow-sm animate-slide-up animation-delay-400">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-slate-400" />
                Notifications
              </CardTitle>
              <Badge variant="outline" className="text-slate-500">
                {notifications.length} new
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg",
                  notification.type === "warning"
                    ? "bg-amber-50"
                    : "bg-slate-50"
                )}
              >
                {notification.type === "warning" ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={cn(
                      "text-sm",
                      notification.type === "warning"
                        ? "text-amber-900"
                        : "text-slate-700"
                    )}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Emergency Button */}
        <Button
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
        >
          <Phone className="w-4 h-4 mr-2" />
          Emergency Contact School
        </Button>
      </div>
    </div>
  );
}
