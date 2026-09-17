"use client";

import { useMemo, useState } from "react";
import { Download, Filter, MapPin, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trafficAlerts, intersections, vehicles } from "@/lib/mockData";
import { TrafficTrends } from "@/components/charts/TrafficTrends";
import { DelayPrediction } from "@/components/charts/DelayPrediction";

type Detection = { id: string; type: string; zone: string; severity: string; route: string; status: string; source: string; confidence: number };
const detections: Detection[] = [
  { id: "AI-001", type: "Pothole", zone: "Downtown", severity: "High", route: "Route 42", status: "Assigned", source: "TRK-102", confidence: 0.94 },
  { id: "AI-002", type: "Congestion", zone: "Midtown", severity: "High", route: "Route 17", status: "Detected", source: "TRK-104", confidence: 0.91 },
  { id: "AI-003", type: "Road construction", zone: "Downtown", severity: "Medium", route: "Route 42", status: "Reported", source: "TRK-102", confidence: 0.89 },
  { id: "AI-004", type: "Obstruction", zone: "Uptown", severity: "Low", route: "Route 86", status: "Resolved", source: "TRK-101", confidence: 0.86 },
  { id: "AI-005", type: "Accident / hazard", zone: "Midtown", severity: "High", route: "Route 17", status: "Under Review", source: "TRK-104", confidence: 0.93 },
];

function download(name: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export function AuthorityAnalytics() {
  const [zone, setZone] = useState("All");
  const [type, setType] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [route, setRoute] = useState("All");
  const [status, setStatus] = useState("All");
  const [range, setRange] = useState("24h");
  const filtered = useMemo(() => detections.filter((item) => (zone === "All" || item.zone === zone) && (type === "All" || item.type === type) && (severity === "All" || item.severity === severity) && (route === "All" || item.route === route) && (status === "All" || item.status === status)), [zone, type, severity, route, status]);
  const kpis = { detections: filtered.length * (range === "7d" ? 7 : range === "30d" ? 18 : 1), potholes: filtered.filter((item) => item.type === "Pothole").length, hazards: filtered.filter((item) => item.severity === "High").length, buses: new Set(filtered.map((item) => item.source)).size, complaints: filtered.filter((item) => item.status === "Reported").length, resolved: filtered.filter((item) => item.status === "Resolved").length };
  const insights = filtered.length ? [`AI detected ${filtered.filter((item) => item.severity === "High").length} high-severity signals; prioritize ${filtered[0].zone} operations.`, `${new Set(filtered.map((item) => item.route)).size} routes are affected by the current evidence set.`, `Recommended action: dispatch maintenance and review route timing for ${filtered[0].route}.`] : ["No matching evidence in the selected filters. Expand the area or detection type to see operational insights."];
  const trafficTrend = ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"].map((time, index) => ({ time, vehicles: filtered.length * (index + 2) * 120, avgSpeed: Math.max(12, 42 - filtered.filter((item) => item.severity === "High").length * 4 - index * 2), congestion: Math.min(96, filtered.length * 8 + index * 5) }));
  const delayPrediction = [...new Set(filtered.map((item) => item.route))].map((routeName, index) => ({ route: routeName, currentDelay: filtered.filter((item) => item.route === routeName).length * 3, predictedDelay: filtered.filter((item) => item.route === routeName).length * 3 + (index + 1) * 2, trend: "increasing" as const }));
  const select = (label: string, value: string, setValue: (value: string) => void, options: string[]) => <label className="text-xs text-slate-400">{label}<select value={value} onChange={(event) => setValue(event.target.value)} className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2 text-sm text-slate-100"><option>All</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;

  return <main className="min-h-screen bg-[#0a0f1a] p-4 pt-12 text-slate-100 lg:p-6 lg:pt-6"><div className="mx-auto max-w-[1600px] space-y-5"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[.2em] text-cyan-300">TRACKO central intelligence</p><h1 className="mt-2 text-3xl font-bold">AI Detection & Traffic Analysis</h1><p className="mt-1 text-sm text-slate-400">Bus sensing becomes hotspots, route action, and maintenance priorities.</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => download("tracko-filtered-detections.csv", ["id,type,zone,severity,route,status,source,confidence", ...filtered.map((item) => Object.values(item).join(","))].join("\n"), "text/csv")}><Download className="mr-2 size-4" />Export CSV</Button><Button onClick={() => download("tracko-filtered-detections.json", JSON.stringify(filtered, null, 2), "application/json")}><Download className="mr-2 size-4" />JSON</Button></div></header>
    <Card className="border-slate-800 bg-[#111c31] text-slate-100"><CardHeader><CardTitle className="flex items-center gap-2"><Filter className="size-4 text-cyan-300" />Operational filters <Badge variant="outline">{filtered.length} records</Badge></CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">{select("Date range", range, setRange, ["24h", "7d", "30d"])}{select("Area / zone", zone, setZone, ["Downtown", "Midtown", "Uptown"])}{select("Detection type", type, setType, [...new Set(detections.map((item) => item.type))])}{select("Severity", severity, setSeverity, ["Low", "Medium", "High"])}{select("Bus / route", route, setRoute, ["Route 42", "Route 17", "Route 86"])}{select("Issue status", status, setStatus, ["Detected", "Reported", "Assigned", "Under Review", "Resolved"])}</CardContent></Card>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">{[["Total AI detections", kpis.detections], ["Potholes detected", kpis.potholes], ["Active road hazards", kpis.hazards], ["Buses sensing", kpis.buses], ["Citizen complaints", kpis.complaints], ["Resolved issues", kpis.resolved]].map(([label, value]) => <Card key={String(label)} className="border-slate-800 bg-[#111c31] text-slate-100"><CardContent className="p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></CardContent></Card>)}</section>
    <section className="grid gap-4 xl:grid-cols-2"><TrafficTrends data={trafficTrend} theme="dark" /><DelayPrediction data={delayPrediction} theme="dark" /></section>
    <section className="grid gap-4 lg:grid-cols-[1fr_.8fr]"><Card className="border-slate-800 bg-[#111c31] text-slate-100"><CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="size-4 text-amber-300" />Filtered detection map and hotspots</CardTitle></CardHeader><CardContent><div className="grid gap-3 md:grid-cols-2">{intersections.filter((item) => filtered.some((record) => record.zone === (item.id % 2 ? "Downtown" : "Midtown"))).slice(0, 4).map((item) => <div key={item.id} className="rounded-lg border border-slate-700 p-4"><div className="flex justify-between"><span>{item.name}</span><Badge>{item.congestion}%</Badge></div><div className="mt-3 h-2 rounded bg-slate-800"><div className="h-2 rounded bg-amber-400" style={{ width: `${item.congestion}%` }} /></div><p className="mt-2 text-xs text-slate-500">Affected route evidence linked to current filters</p></div>)}</div></CardContent></Card><Card className="border-cyan-400/20 bg-[#111c31] text-slate-100"><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="size-4 text-cyan-300" />AI insights and action</CardTitle></CardHeader><CardContent className="space-y-3">{insights.map((insight) => <p key={insight} className="border-l-2 border-cyan-400 pl-3 text-sm text-slate-300">{insight}</p>)}<div className="rounded-lg bg-emerald-400/10 p-3 text-sm text-emerald-200">Optimization opportunity: reroute affected buses to reduce projected delay by 8 minutes.</div></CardContent></Card></section>
    <Card className="border-slate-800 bg-[#111c31] text-slate-100"><CardHeader><CardTitle>Detection evidence stream</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase text-slate-500"><tr>{["ID", "Type", "Zone", "Severity", "Route", "Status", "Source", "Confidence"].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody>{filtered.map((item) => <tr key={item.id} className="border-t border-slate-800"><td className="p-3 text-cyan-300">{item.id}</td><td className="p-3">{item.type}</td><td className="p-3">{item.zone}</td><td className="p-3"><Badge>{item.severity}</Badge></td><td className="p-3">{item.route}</td><td className="p-3">{item.status}</td><td className="p-3">{item.source}</td><td className="p-3">{Math.round(item.confidence * 100)}%</td></tr>)}</tbody></table></div>{!filtered.length && <p className="p-8 text-center text-sm text-slate-500">No evidence matches the current filters.</p>}</CardContent></Card>
    <p className="text-xs text-slate-500">Live supporting signals: {vehicles.filter((vehicle) => vehicle.type === "bus").length} buses online · {trafficAlerts.length} city alerts · {intersections.length} mapped intersections.</p></div></main>;
}
