"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Bot, Check, CircleAlert, Filter, MapPin, RotateCcw, ScanLine } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAIDetectionState } from '@/hooks/useAIDetectionState'
import { useAIDemonstration } from '@/hooks/useAIDemonstration'
import {
  confidenceLabel,
  detectionTypes,
  formatDateTime,
  formatDetectionType,
  severityScale,
  statuses,
  type AIDetectionEvent,
  type AIProcessingStatus,
} from '@/lib/ai/types'

const bus = { busId: 'TRK-102', routeId: 'R-17', routeName: 'Central Loop' }

const statusText: Record<AIProcessingStatus, string> = {
  READY: 'READY',
  CONNECTING: 'CONNECTING',
  PROCESSING: 'PROCESSING',
  DETECTION_FOUND: 'DETECTION FOUND',
  NO_DETECTION: 'NO DETECTION',
  YOLO_OFFLINE: 'YOLO SERVER OFFLINE',
  ERROR: 'ERROR',
}

function PotholeDetectionFeed({
  status,
  running,
  elapsed,
  onStart,
  onPause,
  onStop,
  latest,
}: {
  status: AIProcessingStatus
  running: boolean
  elapsed: number
  onStart: () => void
  onPause: () => void
  onStop: () => void
  latest?: AIDetectionEvent
}) {
  const detectionMarkers = [
    { id: 'P-01', label: 'Pothole 01', confidence: '92%', left: '31%', top: '52%', activeAt: 5 },
    { id: 'P-02', label: 'Pothole 02', confidence: '88%', left: '54%', top: '59%', activeAt: 11 },
    { id: 'P-03', label: 'Pothole 03', confidence: '95%', left: '61%', top: '84%', activeAt: 17 },
  ]

  return (
    <Card className="overflow-hidden border-cyan-400/20 bg-[#111c31] text-slate-100 shadow-[0_18px_60px_rgba(8,145,178,.12)]">
      <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-white/10 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <ScanLine className="size-4 text-cyan-300" />
            Live pothole detection
          </CardTitle>
          <p className="mt-1 text-xs text-slate-500">
            {bus.busId} · {bus.routeId} {bus.routeName} · front camera
          </p>
        </div>
        <Badge variant="outline" className={`status-${status.toLowerCase()}`}>{statusText[status]}</Badge>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative aspect-[4/5] overflow-hidden bg-black sm:aspect-[16/9]">
          <img
            src="/demo/pothole2.png"
            alt="Road image being scanned for potholes"
            className="size-full object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0">
            {running && <div className="absolute inset-x-0 top-0 h-1 animate-[scan-beam_2.4s_ease-in-out_infinite] bg-cyan-300 shadow-[0_0_24px_8px_rgba(103,232,249,.75)]" />}
            {detectionMarkers.map((marker) => {
              const active = elapsed >= marker.activeAt
              return (
                <div
                  key={marker.id}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${active ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
                  style={{ left: marker.left, top: marker.top }}
                >
                  <div className="relative flex size-11 items-center justify-center rounded-full border-2 border-red-400 bg-red-500/25 shadow-[0_0_0_6px_rgba(248,113,113,.16),0_0_22px_rgba(248,113,113,.8)] animate-pulse">
                    <CircleAlert className="size-6 text-white" />
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-lg">
                      {marker.label} · {marker.confidence}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/85 to-transparent px-4 pb-8 pt-4 text-[10px] font-semibold uppercase tracking-[.18em] text-white">
            <span className="flex items-center gap-2"><span className="size-2 animate-pulse rounded-full bg-cyan-300" />AI road scan</span>
            <span>{detectionMarkers.filter((marker) => elapsed >= marker.activeAt).length}/3 detected</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 bg-gradient-to-t from-black/90 to-transparent px-4 pb-4 pt-10">
            <Button size="sm" variant="secondary" onClick={running ? onPause : onStart}>
              {running ? 'Pause scan' : 'Run pothole scan'}
            </Button>
            <Button size="sm" variant="ghost" onClick={onStop} className="text-white hover:bg-white/10 hover:text-white">
              Reset
            </Button>
            <span className="ml-auto text-xs text-slate-300">
              {latest ? `${formatDetectionType(latest.eventType)} · ${formatDateTime(latest.timestamp)}` : `${elapsed}s scan ${running ? 'in progress' : 'ready'}`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Details({ event }: { event?: AIDetectionEvent }) {
  if (!event) {
    return (
      <Card className="border-white/10 bg-[#111c31] text-slate-100">
        <CardContent className="flex min-h-[240px] items-center justify-center p-6 text-center text-sm text-slate-500">
          Select a detection marker or row to inspect the full evidence record.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-white/10 bg-[#111c31] text-slate-100">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-cyan-300" />
            {formatDetectionType(event.eventType)}
          </span>
          <Badge>{event.status}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950">
          <img
            src={event.imageUrl || '/demo/pothole2.png'}
            alt={`${formatDetectionType(event.eventType)} evidence frame`}
            className="aspect-[16/9] w-full object-cover"
          />
          <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
            Frame {event.frameNumber} � {formatDateTime(event.timestamp)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-slate-500">Location</p>
            <p className="mt-1 text-slate-200">{event.locationLabel || event.roadName || 'Mapped coordinates'}</p>
          </div>
          <div>
            <p className="text-slate-500">Coordinates</p>
            <p className="mt-1 text-slate-200">
              {event.latitude.toFixed(5)}, {event.longitude.toFixed(5)}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Captured by</p>
            <p className="mt-1 text-slate-200">{event.source || event.busId}</p>
          </div>
          <div>
            <p className="text-slate-500">Impact</p>
            <p className="mt-1 text-slate-200">{event.laneImpact || 'Not specified'}</p>
          </div>
        </div>

        {event.notes && <p className="border-l-2 border-cyan-400 pl-3 text-xs text-slate-400">{event.notes}</p>}
      </CardContent>
    </Card>
  )
}

export function AICommandCenter() {
  const { events, alerts, addEvent, acknowledgeAlert } = useAIDetectionState()
  const [latest, setLatest] = useState<AIDetectionEvent | undefined>()
  const [filters, setFilters] = useState({
    type: 'All',
    severity: 'All',
    status: 'All',
    bus: 'All',
    route: 'All',
    confidence: 0,
  })

  const onDetection = useCallback((event: AIDetectionEvent) => {
    addEvent(event)
    setLatest(event)
  }, [addEvent])

  const demo = useAIDemonstration(onDetection)

  useEffect(() => {
    demo.start()
  }, [demo.start])

  const filtered = useMemo(
    () =>
      events.filter(
        (event) =>
          (filters.type === 'All' || event.eventType === filters.type) &&
          (filters.severity === 'All' || event.severity === filters.severity) &&
          (filters.status === 'All' || event.status === filters.status) &&
          (filters.bus === 'All' || event.busId === filters.bus) &&
          (filters.route === 'All' || event.routeId === filters.route) &&
          event.confidence >= filters.confidence,
      ),
    [events, filters],
  )

  const buses = [...new Set(events.map((event) => event.busId))]
  const routes = [...new Set(events.map((event) => event.routeId))]

  const setFilter = (key: keyof typeof filters, value: string | number) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  const reset = () => {
    setFilters({ type: 'All', severity: 'All', status: 'All', bus: 'All', route: 'All', confidence: 0 })
  }

  return (
    <main className="ai-dashboard min-h-screen bg-[#0b1220] text-slate-100">
      <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[.22em] text-violet-300">
              <Bot className="size-3" />
              Operations / computer vision
            </p>
            <h1 className="text-3xl font-semibold">AI Mobility Sensing</h1>
            <p className="mt-2 text-sm text-slate-400">
              Road evidence with timestamps, coordinates, and response status.
            </p>
          </div>
          <Badge>DEMO / SIMULATED AI INFERENCE</Badge>
        </header>

        <section className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['AI buses online', '3 / 4'],
            ['Events in view', filtered.length],
            ['Potholes detected', filtered.filter((event) => event.eventType === 'pothole').length],
            ['Active AI alerts', alerts.filter((alert) => !alert.acknowledged).length],
          ].map(([label, value]) => (
            <Card key={String(label)} className="border-white/10 bg-[#111c31] text-slate-100">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-semibold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="grid gap-4">
          <PotholeDetectionFeed
            status={demo.status}
            running={demo.isRunning}
            elapsed={demo.elapsed}
            onStart={demo.start}
            onPause={demo.pause}
            onStop={demo.stop}
            latest={latest}
          />

        </div>

        <Card className="mt-4 border-white/10 bg-[#111c31] text-slate-100">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="size-4 text-violet-300" />
              Detection filters
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw className="mr-2 size-3" />
              Reset
            </Button>
          </CardHeader>

          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {[
              ['type', detectionTypes],
              ['severity', severityScale],
              ['status', statuses],
              ['bus', buses],
              ['route', routes],
            ].map(([key, values]) => (
              <label key={String(key)} className="text-xs text-slate-400">
                {String(key)}
                <select
                  value={String(filters[key as keyof typeof filters])}
                  onChange={(event) => setFilter(key as keyof typeof filters, event.target.value)}
                  className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-2 py-2 text-sm text-slate-100"
                >
                  <option>All</option>
                  {(values as string[]).map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            ))}

            <label className="text-xs text-slate-400">
              Min confidence
              <span className="text-slate-200"> {Math.round(filters.confidence * 100)}%</span>
              <input
                type="range"
                min="0"
                max="1"
                step=".01"
                value={filters.confidence}
                onChange={(event) => setFilter('confidence', Number(event.target.value))}
                className="mt-3 w-full accent-violet-400"
              />
            </label>

            <div className="flex items-end text-xs text-slate-500">
              {filtered.length} of {events.length} records
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
          <Card className="border-white/10 bg-[#111c31] text-slate-100">
            <CardHeader>
              <CardTitle className="text-base">Detection event stream</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filtered.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No detections match the current filters.</p>}
              {filtered.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setLatest(event)}
                  className={`grid w-full grid-cols-[1fr_auto] gap-3 rounded-lg border p-3 text-left ${
                    latest?.id === event.id ? 'border-cyan-400/60 bg-cyan-400/5' : 'border-white/10 hover:bg-white/5'
                  }`}
                >
                  <span>
                    <span className="flex flex-wrap items-center gap-2 text-sm font-medium">
                      {formatDetectionType(event.eventType)}
                      <Badge variant="outline" className={`severity-${event.severity.toLowerCase()}`}>{event.severity}</Badge>
                      <span className="text-xs text-slate-500">{event.status}</span>
                    </span>
                    <span className="mt-1 block text-xs text-slate-400">
                      {event.locationLabel || event.roadName || 'Mapped road segment'} � {event.busId} � {formatDateTime(event.timestamp)}
                    </span>
                  </span>
                  <span className="text-right text-xs text-slate-400">
                    {confidenceLabel(event.confidence)}
                    <br />
                    Frame {event.frameNumber}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Details event={latest} />
        </div>

        <Card className="mt-4 border-white/10 bg-[#111c31] text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-amber-300" />
              Active alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.filter((alert) => !alert.acknowledged).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 p-3">
                <div>
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(alert.createdAt)}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => acknowledgeAlert(alert.id)}>
                  <Check className="mr-2 size-3" />
                  Acknowledge
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
