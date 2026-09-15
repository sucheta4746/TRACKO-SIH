// Google Maps API Helper Functions

export interface LatLng {
  lat: number;
  lng: number;
}

export interface TrafficData {
  route: string;
  duration: number;
  durationInTraffic: number;
  distance: number;
  trafficCondition: "free" | "light" | "moderate" | "heavy" | "severe";
}

export interface RouteInfo {
  origin: LatLng;
  destination: LatLng;
  waypoints?: LatLng[];
  distance: string;
  duration: string;
  durationInTraffic: string;
  polyline: string;
  steps: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
  maneuver?: string;
}

// Calculate traffic condition based on delay ratio
export function getTrafficCondition(duration: number, durationInTraffic: number): TrafficData["trafficCondition"] {
  const ratio = durationInTraffic / duration;
  if (ratio <= 1.1) return "free";
  if (ratio <= 1.3) return "light";
  if (ratio <= 1.5) return "moderate";
  if (ratio <= 1.8) return "heavy";
  return "severe";
}

// Format distance for display
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} m`;
  }
  const miles = meters / 1609.34;
  return `${miles.toFixed(1)} mi`;
}

// Format duration for display
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  return `${minutes} min`;
}

// Calculate ETA based on current time and duration
export function calculateETA(durationSeconds: number): string {
  const eta = new Date(Date.now() + durationSeconds * 1000);
  return eta.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Mock function to simulate Google Maps Directions API response
export async function getDirections(
  origin: LatLng,
  destination: LatLng,
  waypoints?: LatLng[]
): Promise<RouteInfo> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Calculate mock distance and duration based on coordinates
  const distance = calculateHaversineDistance(origin, destination);
  const baseDuration = distance / 40 * 3600; // Assume 40 mph average
  const trafficMultiplier = 1 + Math.random() * 0.5; // Random traffic factor
  const durationInTraffic = baseDuration * trafficMultiplier;

  return {
    origin,
    destination,
    waypoints,
    distance: formatDistance(distance * 1609.34), // Convert miles to meters then format
    duration: formatDuration(baseDuration),
    durationInTraffic: formatDuration(durationInTraffic),
    polyline: "mock_polyline_data",
    steps: [
      {
        instruction: "Head north on Main Street",
        distance: "0.5 mi",
        duration: "2 min",
        maneuver: "straight",
      },
      {
        instruction: "Turn right onto Highway 101",
        distance: "3.2 mi",
        duration: "5 min",
        maneuver: "turn-right",
      },
      {
        instruction: "Take exit 42 toward Downtown",
        distance: "0.3 mi",
        duration: "1 min",
        maneuver: "ramp-right",
      },
      {
        instruction: "Arrive at destination",
        distance: "",
        duration: "",
        maneuver: "arrive",
      },
    ],
  };
}

// Haversine formula to calculate distance between two points
function calculateHaversineDistance(point1: LatLng, point2: LatLng): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) *
      Math.cos(toRadians(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Get traffic flow data for a region
export async function getTrafficFlow(
  center: LatLng,
  radius: number
): Promise<TrafficData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Generate mock traffic data for nearby routes
  const routes = [
    "I-95 North",
    "I-95 South",
    "Highway 101",
    "Main Street",
    "Broadway",
    "Downtown Loop",
  ];

  return routes.map(route => {
    const baseDuration = 600 + Math.random() * 1200;
    const trafficFactor = 1 + Math.random() * 0.8;
    const durationInTraffic = baseDuration * trafficFactor;
    
    return {
      route,
      duration: baseDuration,
      durationInTraffic,
      distance: 5 + Math.random() * 15,
      trafficCondition: getTrafficCondition(baseDuration, durationInTraffic),
    };
  });
}

// Find nearby places (POIs)
export async function getNearbyPlaces(
  location: LatLng,
  type: string,
  radius: number = 5000
): Promise<Array<{ name: string; location: LatLng; address: string }>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));

  // Mock places data
  return [
    {
      name: "Lincoln Elementary School",
      location: { lat: location.lat + 0.01, lng: location.lng + 0.005 },
      address: "123 School Street",
    },
    {
      name: "Washington Middle School",
      location: { lat: location.lat - 0.008, lng: location.lng + 0.012 },
      address: "456 Education Blvd",
    },
    {
      name: "Jefferson High School",
      location: { lat: location.lat + 0.015, lng: location.lng - 0.008 },
      address: "789 Academy Ave",
    },
  ];
}

// Geocode an address to coordinates
export async function geocodeAddress(address: string): Promise<LatLng | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock geocoding - return NYC coordinates with small variations
  return {
    lat: 40.7128 + (Math.random() - 0.5) * 0.1,
    lng: -74.006 + (Math.random() - 0.5) * 0.1,
  };
}

// Reverse geocode coordinates to address
export async function reverseGeocode(location: LatLng): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  // Mock address
  const streetNumber = Math.floor(Math.random() * 1000) + 1;
  const streets = ["Main St", "Broadway", "5th Avenue", "Park Lane", "Oak Street"];
  const street = streets[Math.floor(Math.random() * streets.length)];
  
  return `${streetNumber} ${street}, New York, NY`;
}
