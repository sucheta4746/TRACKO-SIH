"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GoogleMap } from "@/components/shared/GoogleMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trafficAlerts, intersections } from "@/lib/mockData";
import {
  Search,
  MapPin,
  Clock,
  Car,
  Bus,
  Bike,
  Footprints,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Navigation,
  X,
  Calendar,
  Star,
} from "lucide-react";

// Route options for search results
const routeOptions = [
  {
    id: 1,
    mode: "car",
    icon: Car,
    duration: "18 min",
    distance: "5.2 mi",
    traffic: "moderate",
    eta: "2:35 PM",
    recommended: true,
  },
  {
    id: 2,
    mode: "bus",
    icon: Bus,
    duration: "32 min",
    distance: "5.8 mi",
    traffic: "light",
    eta: "2:49 PM",
    route: "Bus 42 → Bus 15",
  },
  {
    id: 3,
    mode: "bike",
    icon: Bike,
    duration: "25 min",
    distance: "4.1 mi",
    traffic: "free",
    eta: "2:42 PM",
  },
  {
    id: 4,
    mode: "walk",
    icon: Footprints,
    duration: "52 min",
    distance: "2.6 mi",
    traffic: "free",
    eta: "3:09 PM",
  },
];

const savedLocations = [
  { name: "Home", address: "123 Main Street, Apt 4B", icon: "🏠" },
  { name: "Work", address: "456 Business Center, Floor 8", icon: "🏢" },
  { name: "Gym", address: "789 Fitness Avenue", icon: "💪" },
];

const recentSearches = [
  { destination: "Central Mall", time: "Yesterday" },
  { destination: "City Hospital", time: "2 days ago" },
  { destination: "Airport Terminal 1", time: "1 week ago" },
];

export default function CitizenDashboard() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);

  // Map markers
  const mapMarkers = intersections.slice(0, 5).map((i) => ({
    id: `intersection-${i.id}`,
    lat: i.lat,
    lng: i.lng,
    type: "intersection" as const,
    label: i.name,
    congestion: i.congestion,
  }));

  const handleSearch = () => {
    if (origin && destination) {
      setShowResults(true);
    }
  };

  const handleSelectRoute = (routeId: number) => {
    setSelectedRoute(routeId);
  };

  const trafficConditionColor = (traffic: string) => {
    switch (traffic) {
      case "free":
        return "text-emerald-600 bg-emerald-50";
      case "light":
        return "text-emerald-600 bg-emerald-50";
      case "moderate":
        return "text-amber-600 bg-amber-50";
      case "heavy":
        return "text-red-600 bg-red-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  // Get active alerts
  const activeAlerts = trafficAlerts.filter((a) => a.severity === "high" || a.severity === "medium").slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Search Card */}
        <Card className="bg-white border-slate-200 shadow-sm animate-slide-up">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Origin */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0" />
                <Input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Starting point (or use current location)"
                  className="border-0 bg-slate-100 text-slate-900"
                />
                {origin && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setOrigin("")}
                    className="h-8 w-8 text-slate-400 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Dotted line */}
              <div className="flex items-center gap-3">
                <div className="w-3 flex flex-col items-center gap-0.5">
                  <div className="w-0.5 h-1 bg-slate-300 rounded" />
                  <div className="w-0.5 h-1 bg-slate-300 rounded" />
                  <div className="w-0.5 h-1 bg-slate-300 rounded" />
                </div>
                <div className="flex-1" />
              </div>

              {/* Destination */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-600 flex-shrink-0" />
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where are you going?"
                  className="border-0 bg-slate-100 text-slate-900"
                />
                {destination && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setDestination("")}
                    className="h-8 w-8 text-slate-400 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={!origin || !destination}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Find Routes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results or Suggestions */}
        {showResults ? (
          <>
            {/* Route Options */}
            <Card className="bg-white border-slate-200 shadow-sm animate-slide-up animation-delay-100">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Route Options
                  </CardTitle>
                  <Badge variant="outline" className="text-slate-500">
                    {routeOptions.length} routes found
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {routeOptions.map((route) => {
                  const RouteIcon = route.icon;
                  const isSelected = selectedRoute === route.id;

                  return (
                    <button
                      key={route.id}
                      onClick={() => handleSelectRoute(route.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left",
                        isSelected
                          ? "bg-emerald-50 border-2 border-emerald-500"
                          : "bg-slate-50 border-2 border-transparent hover:border-slate-200"
                      )}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                          isSelected ? "bg-emerald-600" : "bg-slate-200"
                        )}
                      >
                        <RouteIcon
                          className={cn(
                            "w-6 h-6",
                            isSelected ? "text-white" : "text-slate-600"
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900 capitalize">
                            {route.mode}
                          </p>
                          {route.recommended && (
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <span className="font-medium text-slate-900">
                            {route.duration}
                          </span>
                          <span>·</span>
                          <span>{route.distance}</span>
                          {route.route && (
                            <>
                              <span>·</span>
                              <span>{route.route}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">
                          ETA {route.eta}
                        </p>
                        <Badge
                          className={cn(
                            "text-xs capitalize",
                            trafficConditionColor(route.traffic)
                          )}
                        >
                          {route.traffic} traffic
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Map */}
            <div className="animate-slide-up animation-delay-200">
              <GoogleMap
                markers={mapMarkers}
                showTrafficLayer={true}
                height="250px"
                theme="light"
                showRoute={selectedRoute !== null}
              />
            </div>

            {/* Selected Route Details */}
            {selectedRoute && (
              <Card className="bg-white border-slate-200 shadow-sm animate-slide-up">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Estimated arrival</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {routeOptions.find((r) => r.id === selectedRoute)?.eta}
                      </p>
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Navigation className="w-4 h-4 mr-2" />
                      Start Navigation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* Saved Locations */}
            <Card className="bg-white border-slate-200 shadow-sm animate-slide-up animation-delay-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Saved Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {savedLocations.map((location) => (
                  <button
                    key={location.name}
                    onClick={() => setDestination(location.address)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  >
                    <span className="text-xl">{location.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{location.name}</p>
                      <p className="text-sm text-slate-500">{location.address}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Recent Searches */}
            <Card className="bg-white border-slate-200 shadow-sm animate-slide-up animation-delay-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-400" />
                  Recent Searches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setDestination(search.destination)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{search.destination}</p>
                      <p className="text-sm text-slate-500">{search.time}</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Traffic Map Preview */}
            <div className="animate-slide-up animation-delay-300">
              <p className="text-sm font-medium text-slate-700 mb-2">Live Traffic</p>
              <GoogleMap
                markers={mapMarkers}
                showTrafficLayer={true}
                height="200px"
                theme="light"
              />
            </div>

            {/* Active Traffic Alerts */}
            {activeAlerts.length > 0 && (
              <Card className="bg-white border-slate-200 shadow-sm animate-slide-up animation-delay-400">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Traffic Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg",
                        alert.severity === "high"
                          ? "bg-red-50 border border-red-200"
                          : "bg-amber-50 border border-amber-200"
                      )}
                    >
                      <AlertTriangle
                        className={cn(
                          "w-5 h-5 flex-shrink-0 mt-0.5",
                          alert.severity === "high" ? "text-red-500" : "text-amber-500"
                        )}
                      />
                      <div>
                        <p
                          className={cn(
                            "text-sm font-medium",
                            alert.severity === "high" ? "text-red-900" : "text-amber-900"
                          )}
                        >
                          {alert.title}
                        </p>
                        <p
                          className={cn(
                            "text-xs mt-0.5",
                            alert.severity === "high" ? "text-red-700" : "text-amber-700"
                          )}
                        >
                          {alert.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
