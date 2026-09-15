"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { GoogleMap } from "@/components/shared/GoogleMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { vehicles, trafficAlerts } from "@/lib/mockData";
import {
  Navigation,
  MapPin,
  Clock,
  AlertTriangle,
  Car,
  Fuel,
  RotateCcw,
  Phone,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ArrowUp,
  ArrowLeft,
  CornerUpRight,
  CornerUpLeft,
  Locate,
  Search,
  X,
} from "lucide-react";

// Simulated navigation data
const navigationSteps = [
  { instruction: "Head north on Main Street", distance: "0.3 mi", icon: ArrowUp, duration: "1 min" },
  { instruction: "Turn right onto Oak Avenue", distance: "0.5 mi", icon: CornerUpRight, duration: "2 min" },
  { instruction: "Continue straight", distance: "1.2 mi", icon: ArrowUp, duration: "4 min" },
  { instruction: "Turn left onto Highway 101", distance: "3.4 mi", icon: CornerUpLeft, duration: "5 min" },
  { instruction: "Take exit 42 toward Downtown", distance: "0.2 mi", icon: CornerUpRight, duration: "1 min" },
  { instruction: "Arrive at destination", distance: "", icon: MapPin, duration: "" },
];

const quickDestinations = [
  { name: "Home", address: "123 Residential Ave", icon: "🏠" },
  { name: "Work", address: "456 Business Park", icon: "🏢" },
  { name: "Gas Station", address: "Nearest - 0.5 mi", icon: "⛽" },
  { name: "Rest Stop", address: "Highway 101", icon: "🅿️" },
];

export default function DriverDashboard() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [destination, setDestination] = useState("");
  const [origin, setOrigin] = useState("Current Location");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [eta, setEta] = useState("15 min");
  const [distance, setDistance] = useState("5.6 mi");

  // Get current vehicle (simulating logged-in driver)
  const currentVehicle = vehicles[0];

  // Map markers for navigation
  const mapMarkers = isNavigating
    ? [
        {
          id: "current",
          lat: currentVehicle.lat,
          lng: currentVehicle.lng,
          type: "vehicle" as const,
          label: "Your Location",
          status: `${currentVehicle.speed} mph`,
        },
        {
          id: "destination",
          lat: 40.758,
          lng: -73.9855,
          type: "intersection" as const,
          label: "Destination",
          congestion: 30,
        },
      ]
    : [
        {
          id: "current",
          lat: currentVehicle.lat,
          lng: currentVehicle.lng,
          type: "vehicle" as const,
          label: "Your Location",
          status: "Parked",
        },
      ];

  const handleStartNavigation = () => {
    if (destination) {
      setIsNavigating(true);
      setCurrentStep(0);
    }
  };

  const handleEndNavigation = () => {
    setIsNavigating(false);
    setDestination("");
    setCurrentStep(0);
  };

  // Simulate step progression
  useEffect(() => {
    if (isNavigating && currentStep < navigationSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isNavigating, currentStep]);

  // Get relevant alerts
  const relevantAlerts = trafficAlerts.filter((a) => a.severity === "high").slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Active Banner */}
      {isNavigating && (
        <div className="bg-blue-600 text-white px-4 py-3 animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 animate-pulse" />
              <div>
                <p className="font-semibold">Navigation Active</p>
                <p className="text-sm text-blue-100">
                  ETA: {eta} | {distance} remaining
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleEndNavigation}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              End
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Search/Destination Input */}
        {!isNavigating && (
          <Card className="bg-white border-slate-200 shadow-sm animate-slide-up">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <Input
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Starting point"
                    className="border-0 bg-slate-100 text-slate-900"
                  />
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where to?"
                    className="border-0 bg-slate-100 text-slate-900"
                  />
                  {destination && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDestination("")}
                      className="h-8 w-8 text-slate-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {destination && (
                  <Button
                    onClick={handleStartNavigation}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Start Navigation
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Destinations */}
        {!isNavigating && !destination && (
          <div className="animate-slide-up animation-delay-100">
            <p className="text-sm font-medium text-slate-700 mb-2">Quick Access</p>
            <div className="grid grid-cols-2 gap-2">
              {quickDestinations.map((dest) => (
                <button
                  key={dest.name}
                  onClick={() => setDestination(dest.address)}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 text-left hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                >
                  <span className="text-xl">{dest.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{dest.name}</p>
                    <p className="text-xs text-slate-500">{dest.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        <div className="animate-slide-up animation-delay-200">
          <GoogleMap
            markers={mapMarkers}
            showTrafficLayer={true}
            height={isNavigating ? "250px" : "300px"}
            theme="light"
            showRoute={isNavigating}
          />
        </div>

        {/* Navigation Steps (when navigating) */}
        {isNavigating && (
          <Card className="bg-white border-slate-200 shadow-sm animate-slide-up animation-delay-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  Turn-by-Turn Directions
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={cn(
                      "h-8 w-8",
                      voiceEnabled ? "text-blue-600" : "text-slate-400"
                    )}
                  >
                    {voiceEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowSteps(!showSteps)}
                    className="h-8 w-8 text-slate-400"
                  >
                    {showSteps ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            {showSteps && (
              <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                {navigationSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCurrent = index === currentStep;
                  const isPast = index < currentStep;

                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-all",
                        isCurrent
                          ? "bg-blue-50 border border-blue-200"
                          : isPast
                          ? "bg-slate-50 opacity-60"
                          : "bg-white"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          isCurrent
                            ? "bg-blue-600 text-white"
                            : isPast
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        )}
                      >
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isCurrent ? "text-blue-900" : "text-slate-700"
                          )}
                        >
                          {step.instruction}
                        </p>
                        {step.distance && (
                          <p className="text-xs text-slate-500">
                            {step.distance} · {step.duration}
                          </p>
                        )}
                      </div>
                      {isCurrent && (
                        <Badge className="bg-blue-600 text-white">Now</Badge>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            )}
          </Card>
        )}

        {/* Traffic Alerts */}
        {relevantAlerts.length > 0 && (
          <Card className="bg-white border-slate-200 shadow-sm animate-slide-up animation-delay-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Traffic Alerts on Route
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {relevantAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900">{alert.title}</p>
                    <p className="text-xs text-amber-700 mt-0.5">{alert.location}</p>
                    <p className="text-xs text-amber-600 mt-1">
                      ETA impact: +5 min
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reroute
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Vehicle Status */}
        <Card className="bg-white border-slate-200 shadow-sm animate-slide-up animation-delay-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600" />
              Vehicle Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-slate-50">
                <Fuel className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                <p className="text-lg font-bold text-slate-900">75%</p>
                <p className="text-xs text-slate-500">Fuel Level</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-50">
                <Navigation className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                <p className="text-lg font-bold text-slate-900">{currentVehicle.speed}</p>
                <p className="text-xs text-slate-500">Speed (mph)</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-50">
                <Clock className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                <p className="text-lg font-bold text-slate-900">2:45</p>
                <p className="text-xs text-slate-500">Drive Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Button */}
        <Button
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
        >
          <Phone className="w-4 h-4 mr-2" />
          Emergency Contact
        </Button>
      </div>
    </div>
  );
}
