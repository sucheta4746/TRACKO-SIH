import { NextResponse } from "next/server";

// Mock traffic data endpoint - simulates real-time traffic updates
export async function GET() {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const trafficData = {
    timestamp: new Date().toISOString(),
    region: "NYC Metro Area",
    summary: {
      totalVehicles: 12847 + Math.floor(Math.random() * 500),
      averageSpeed: 32 + Math.floor(Math.random() * 10),
      congestionLevel: 42 + Math.floor(Math.random() * 15),
      activeIncidents: 7 + Math.floor(Math.random() * 3),
    },
    routes: [
      {
        id: "i95-north",
        name: "I-95 North",
        currentSpeed: 45 + Math.floor(Math.random() * 15),
        normalSpeed: 65,
        delay: Math.floor(Math.random() * 20),
        condition: getRandomCondition(),
      },
      {
        id: "i95-south",
        name: "I-95 South",
        currentSpeed: 55 + Math.floor(Math.random() * 10),
        normalSpeed: 65,
        delay: Math.floor(Math.random() * 10),
        condition: getRandomCondition(),
      },
      {
        id: "highway-101",
        name: "Highway 101",
        currentSpeed: 50 + Math.floor(Math.random() * 10),
        normalSpeed: 55,
        delay: Math.floor(Math.random() * 8),
        condition: getRandomCondition(),
      },
      {
        id: "main-street",
        name: "Main Street",
        currentSpeed: 25 + Math.floor(Math.random() * 10),
        normalSpeed: 35,
        delay: Math.floor(Math.random() * 15),
        condition: getRandomCondition(),
      },
      {
        id: "broadway",
        name: "Broadway",
        currentSpeed: 20 + Math.floor(Math.random() * 10),
        normalSpeed: 30,
        delay: Math.floor(Math.random() * 12),
        condition: getRandomCondition(),
      },
      {
        id: "downtown-loop",
        name: "Downtown Loop",
        currentSpeed: 15 + Math.floor(Math.random() * 15),
        normalSpeed: 25,
        delay: Math.floor(Math.random() * 20),
        condition: getRandomCondition(),
      },
    ],
    incidents: [
      {
        id: "inc-1",
        type: "accident",
        location: { lat: 40.7580, lng: -73.9855 },
        description: "Multi-vehicle collision",
        severity: "high",
        reportedAt: new Date(Date.now() - 15 * 60000).toISOString(),
      },
      {
        id: "inc-2",
        type: "roadwork",
        location: { lat: 40.7484, lng: -73.9857 },
        description: "Lane closure for maintenance",
        severity: "medium",
        reportedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      },
    ],
    predictions: {
      nextHour: {
        congestionChange: Math.random() > 0.5 ? "increasing" : "decreasing",
        estimatedDelay: Math.floor(Math.random() * 15),
      },
      peakTime: "5:30 PM",
      peakCongestion: 78 + Math.floor(Math.random() * 10),
    },
  };

  return NextResponse.json(trafficData);
}

function getRandomCondition(): "free" | "light" | "moderate" | "heavy" | "severe" {
  const conditions: Array<"free" | "light" | "moderate" | "heavy" | "severe"> = [
    "free",
    "light",
    "moderate",
    "heavy",
    "severe",
  ];
  const weights = [0.2, 0.3, 0.25, 0.15, 0.1];
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < conditions.length; i++) {
    sum += weights[i];
    if (random < sum) return conditions[i];
  }
  
  return "moderate";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { origin, destination } = body;

    // Simulate route calculation
    await new Promise(resolve => setTimeout(resolve, 300));

    const routeData = {
      origin,
      destination,
      distance: `${(3 + Math.random() * 10).toFixed(1)} mi`,
      duration: `${10 + Math.floor(Math.random() * 30)} min`,
      durationInTraffic: `${15 + Math.floor(Math.random() * 40)} min`,
      trafficCondition: getRandomCondition(),
      steps: [
        { instruction: "Head north on Main Street", distance: "0.5 mi" },
        { instruction: "Turn right onto Highway 101", distance: "2.3 mi" },
        { instruction: "Take exit toward Downtown", distance: "0.8 mi" },
        { instruction: "Arrive at destination", distance: "" },
      ],
      alternativeRoutes: [
        {
          name: "Via Surface Streets",
          duration: `${20 + Math.floor(Math.random() * 25)} min`,
          distance: `${(4 + Math.random() * 8).toFixed(1)} mi`,
        },
        {
          name: "Via Highway",
          duration: `${12 + Math.floor(Math.random() * 20)} min`,
          distance: `${(5 + Math.random() * 10).toFixed(1)} mi`,
        },
      ],
    };

    return NextResponse.json(routeData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to calculate route" },
      { status: 400 }
    );
  }
}
