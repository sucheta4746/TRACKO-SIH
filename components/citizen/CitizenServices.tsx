"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Bus, CheckCircle2, FileText, MapPin, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trafficAlerts, intersections, vehicles } from "@/lib/mockData";

export type CitizenView = "issues" | "report" | "complaints" | "ai-report" | "transit";

type Complaint = {
  id: string;
  type: string;
  location: string;
  description: string;
  severity: string;
  status: "Submitted" | "Under Review" | "Resolved";
  timestamp: string;
  source: "Citizen";
};

const storageKey = "tracko-citizen-complaints";
const initialComplaints: Complaint[] = [
  { id: "CMP-1042", type: "Pothole", location: "Main St & 1st Ave", description: "Deep pothole affecting the right lane.", severity: "High", status: "Under Review", timestamp: "2026-09-17T08:30:00.000Z", source: "Citizen" },
];

function readComplaints(): Complaint[] {
  if (typeof window === "undefined") return initialComplaints;
  const saved = window.localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) as Complaint[] : initialComplaints;
}

export function CitizenServices({ view }: { view: CitizenView }) {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [type, setType] = useState("Pothole");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setComplaints(readComplaints());
  }, []);

  const persist = (next: Complaint[]) => {
    setComplaints(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const submitComplaint = (event: FormEvent) => {
    event.preventDefault();
    if (!location.trim() || !description.trim()) return;
    const next: Complaint = {
      id: `CMP-${Math.floor(1000 + Math.random() * 8999)}`,
      type,
      location: location.trim(),
      description: description.trim(),
      severity,
      status: "Submitted",
      timestamp: new Date().toISOString(),
      source: "Citizen",
    };
    persist([next, ...complaints]);
    setLocation("");
    setDescription("");
    setSubmitted(true);
  };

  const filteredIssues = useMemo(() => trafficAlerts.filter((alert) => alert.severity !== "low"), []);
  const title = view === "issues" ? "Issues Near You" : view === "report" ? "Report a Problem" : view === "complaints" ? "Track Complaints" : view === "ai-report" ? "AI Area Report" : "Live Transit & Hazards";

  return (
    <div className="min-h-screen bg-[#080f20] p-4 pt-10 text-slate-100 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="border-b border-slate-800 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-300">Citizen services / TRACKO central platform</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">Bus AI sensing, citizen observations, and city response in one connected view.</p>
        </header>

        {view === "issues" && <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <Card className="border-slate-800 bg-[#111c31] text-slate-100"><CardHeader><CardTitle>Detected around your area</CardTitle></CardHeader><CardContent className="space-y-3">{filteredIssues.map((issue) => <div key={issue.id} className="flex gap-3 rounded-lg border border-slate-700 p-4"><AlertTriangle className="mt-0.5 text-amber-300" /><div className="flex-1"><div className="flex justify-between gap-2"><p className="font-medium">{issue.title}</p><Badge>{issue.severity}</Badge></div><p className="mt-1 text-sm text-slate-400">{issue.location}</p><p className="mt-2 text-xs text-slate-500">{issue.description}</p></div></div>)}</CardContent></Card>
          <Card className="border-slate-800 bg-[#111c31] text-slate-100"><CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="size-4 text-cyan-300" />Nearby map signals</CardTitle></CardHeader><CardContent><div className="grid gap-2">{intersections.slice(0, 5).map((item) => <div key={item.id} className="flex justify-between rounded border border-slate-800 p-3 text-sm"><span>{item.name}</span><span className={item.congestion > 70 ? "text-red-300" : "text-amber-300"}>{item.congestion}% congestion</span></div>)}</div></CardContent></Card>
        </section>}

        {view === "ai-report" && <section className="grid gap-4 md:grid-cols-3"><Card className="border-violet-400/20 bg-[#111c31] text-slate-100 md:col-span-2"><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="size-4 text-violet-300" />AI area intelligence</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-slate-300">TRACKO has correlated bus camera detections and citizen reports in the central area.</p>{["High concentration of congestion at Broadway & 42nd St", "Repeated road-condition observations on Main St", "Two public transport vehicles reporting slow movement"].map((insight) => <div key={insight} className="rounded-lg border border-violet-400/20 bg-violet-400/5 p-4 text-sm">{insight}</div>)}</CardContent></Card><Card className="border-slate-800 bg-[#111c31] text-slate-100"><CardHeader><CardTitle>Area summary</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-slate-300"><p><strong className="text-white">8</strong> active detections</p><p><strong className="text-white">3</strong> affected routes</p><p><strong className="text-white">2</strong> maintenance signals</p><p className="border-l-2 border-emerald-400 pl-3 text-emerald-200">Recommended action: inspect Main St corridor and adjust Route 42 timing.</p></CardContent></Card></section>}

        {view === "report" && <Card className="max-w-3xl border-slate-800 bg-[#111c31] text-slate-100"><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="size-4 text-cyan-300" />Submit a city issue</CardTitle></CardHeader><CardContent><form onSubmit={submitComplaint} className="grid gap-4 sm:grid-cols-2"><label className="text-sm text-slate-400">Issue type<select value={type} onChange={(event) => setType(event.target.value)} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 p-2 text-slate-100"><option>Pothole</option><option>Road construction</option><option>Obstacle</option><option>Congestion</option><option>Accident / hazard</option></select></label><label className="text-sm text-slate-400">Severity<select value={severity} onChange={(event) => setSeverity(event.target.value)} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 p-2 text-slate-100"><option>Low</option><option>Medium</option><option>High</option></select></label><label className="text-sm text-slate-400 sm:col-span-2">Location<Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Street, landmark, or route" className="mt-1 border-slate-700 bg-slate-950" required /></label><label className="text-sm text-slate-400 sm:col-span-2">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What did you observe?" className="mt-1 min-h-28 w-full rounded-md border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100" required /></label><Button type="submit" className="w-fit bg-cyan-600 hover:bg-cyan-700"><Send className="mr-2 size-4" />Submit complaint</Button>{submitted && <p className="flex items-center text-sm text-emerald-300"><CheckCircle2 className="mr-2 size-4" />Submitted and added to Track Complaints.</p>}</form></CardContent></Card>}

        {view === "complaints" && <Card className="border-slate-800 bg-[#111c31] text-slate-100"><CardHeader><CardTitle>Your connected complaints</CardTitle></CardHeader><CardContent className="space-y-3">{complaints.map((complaint) => <div key={complaint.id} className="grid gap-2 rounded-lg border border-slate-700 p-4 sm:grid-cols-[1fr_auto]"><div><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{complaint.type}</p><Badge variant="outline">{complaint.id}</Badge></div><p className="mt-1 text-sm text-slate-400">{complaint.location} · {complaint.description}</p></div><div className="text-left sm:text-right"><Badge className="bg-cyan-500/15 text-cyan-200">{complaint.status}</Badge><p className="mt-1 text-xs text-slate-500">{new Date(complaint.timestamp).toLocaleString()}</p></div></div>)}</CardContent></Card>}

        {view === "transit" && <section className="grid gap-4 lg:grid-cols-[1fr_1fr]"><Card className="border-slate-800 bg-[#111c31] text-slate-100"><CardHeader><CardTitle className="flex items-center gap-2"><Bus className="size-4 text-cyan-300" />Buses currently sensing</CardTitle></CardHeader><CardContent className="space-y-3">{vehicles.filter((vehicle) => vehicle.type === "bus").map((bus) => <div key={bus.id} className="flex items-center justify-between rounded-lg border border-slate-700 p-4"><div><p className="font-medium">{bus.id.toUpperCase()} · {bus.route}</p><p className="text-xs text-slate-400">Live camera feed connected</p></div><span className="text-emerald-300">{bus.speed} mph</span></div>)}</CardContent></Card><Card className="border-slate-800 bg-[#111c31] text-slate-100"><CardHeader><CardTitle>Live hazards and routes</CardTitle></CardHeader><CardContent className="space-y-3">{trafficAlerts.slice(0, 4).map((alert) => <div key={alert.id} className="rounded-lg border border-slate-700 p-3"><div className="flex justify-between gap-2"><span className="text-sm">{alert.title}</span><Badge>{alert.severity}</Badge></div><p className="mt-1 text-xs text-slate-500">{alert.location}</p></div>)}</CardContent></Card></section>}
      </div>
    </div>
  );
}
