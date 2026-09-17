"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  AlertTriangle,
  Bot,
  MapPin,
  Pause,
  Radio,
  RotateCcw,
  Square,
  Video,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GoogleMap } from "@/components/shared/GoogleMap"
import { useAIDetectionState } from "@/hooks/useAIDetectionState"
import { useAIDemonstration } from "@/hooks/useAIDemonstration"

import {
  aiLocations,
  aiMarker,
  confidenceLabel,
  demoDetections,
  formatDetectionType,
  formatTime,
  type AIDetectionEvent,
  type AIProcessingStatus,
} from "@/lib/ai/types"

const bus = {
  busId: "TRK-102",
  routeId: "R-17",
  routeName: "Central Loop",
  camera: "FRONT CAMERA",
}

/*
 * DEMO GPS LOCATION
 * In the demo this represents the GPS position sent
 * along with every AI detection.
 */
const DEMO_LOCATION = {
  latitude: 30.7046,
  longitude: 76.7179,
}

const statusText: Record<AIProcessingStatus, string> = {
  READY: "READY",
  CONNECTING: "CONNECTING",
  PROCESSING: "PROCESSING",
  DETECTION_FOUND: "DETECTION FOUND",
  NO_DETECTION: "NO DETECTION",
  YOLO_OFFLINE: "YOLO SERVER OFFLINE",
  ERROR: "ERROR",
}

/* =========================================================
   VIDEO OVERLAY
========================================================= */

function Overlay({ events }: { events: AIDetectionEvent[] }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {events.map((event) => {
        const scenario = demoDetections.find(
          (item) => item.eventType === event.eventType
        )

        const x = event.box?.x ?? scenario?.box?.x ?? 0.42
        const y = event.box?.y ?? scenario?.box?.y ?? 0.55
        const width = event.box?.width ?? scenario?.box?.width ?? 0.18
        const height = event.box?.height ?? scenario?.box?.height ?? 0.18

        return (
          <div
            key={event.id}
            className="absolute border-2 border-orange-400 shadow-[0_0_22px_rgba(251,146,60,.7)]"
            style={{
              left: `${x * 100}%`,
              top: `${y * 100}%`,
              width: `${width * 100}%`,
              height: `${height * 100}%`,
            }}
          >
            <span className="absolute -top-7 left-0 whitespace-nowrap rounded bg-orange-500 px-2 py-1 text-[10px] font-bold text-white">
              {formatDetectionType(event.eventType).toUpperCase()} ·{" "}
              {confidenceLabel(event.confidence)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* =========================================================
   VIDEO FEED
========================================================= */

function VideoFeed({
  status,
  running,
  elapsed,
  onStart,
  onPause,
  onStop,
  onTime,
  latest,
}: {
  status: AIProcessingStatus
  running: boolean
  elapsed: number
  onStart: () => void
  onPause: () => void
  onStop: () => void
  onTime: (time: number) => void
  latest?: AIDetectionEvent
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [duration, setDuration] = useState(0)

  const time = (value: number) =>
    `${Math.floor(value / 60)
      .toString()
      .padStart(2, "0")}:${Math.floor(value % 60)
      .toString()
      .padStart(2, "0")}`

  /* =======================================================
     START AI DEMO
  ======================================================= */

  const start = () => {
    console.log("🔥 START AI DEMO CLICKED")

    // Start AI processing
    onStart()

    const video = videoRef.current

    if (!video) {
      console.log("❌ VIDEO REF NULL")
      return
    }

    console.log("✅ VIDEO FOUND")

    video.play().catch((err) => {
      console.error("❌ VIDEO PLAY ERROR:", err)
    })
  }

  /* =======================================================
     PAUSE
  ======================================================= */

  const pause = () => {
    console.log("⏸️ PAUSE CLICKED")

    videoRef.current?.pause()
    onPause()
  }

  /* =======================================================
     STOP
  ======================================================= */

  const stop = () => {
    console.log("⏹️ STOP CLICKED")

    const video = videoRef.current

    if (video) {
      video.pause()
      video.currentTime = 0
    }

    onStop()
  }

  /* =======================================================
     NATIVE VIDEO PLAY
  ======================================================= */

  const handleVideoPlay = () => {
    console.log("▶️ NATIVE VIDEO PLAY")

    if (!running) {
      onStart()
    }
  }

  return (
    <Card className="overflow-hidden border-white/10 bg-[#111c31]">
      <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-white/10 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base text-slate-100">
            <Video className="size-4 text-violet-300" />
            Live bus AI feed
          </CardTitle>

          <p className="mt-1 text-xs text-slate-500">
            {bus.busId} · {bus.routeId} {bus.routeName}
          </p>
        </div>

        <Badge
          className={
            status === "YOLO_OFFLINE"
              ? "border-rose-400/30 bg-rose-500/15 text-rose-200"
              : "border-blue-400/30 bg-blue-500/15 text-blue-200"
          }
        >
          {statusText[status]}
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative aspect-video overflow-hidden bg-black">
          <video
            ref={videoRef}
            onPlay={handleVideoPlay}
            className="size-full object-contain"
            playsInline
            muted
            preload="metadata"
            controls
            onLoadedMetadata={(e) => {
              console.log(
                "🎬 VIDEO LOADED:",
                e.currentTarget.duration,
                "seconds"
              )

              setDuration(e.currentTarget.duration)
            }}
            onTimeUpdate={(e) => {
              onTime(e.currentTarget.currentTime)
            }}
            onEnded={() => {
              console.log("🏁 VIDEO ENDED")
              onStop()
            }}
            onError={(e) => {
              console.error(
                "❌ VIDEO LOAD ERROR:",
                e.currentTarget.error
              )
            }}
          >
            <source
              src="/demo/road-dashcam.mp4"
              type="video/mp4"
            />

            Your browser does not support HTML video.
          </video>

          {/* AI DETECTION BOX */}
          {latest && <Overlay events={[latest]} />}

          {/* CAMERA LABEL */}
          <div className="absolute left-4 top-4 flex items-center gap-2 text-xs text-slate-200">
            <span
              className={`size-2 rounded-full ${
                running
                  ? "animate-pulse bg-rose-400"
                  : "bg-slate-500"
              }`}
            />

            {bus.camera} · VIDEO SOURCE
          </div>

          {/* VIDEO CONTROLS AREA */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 p-4 pt-14">
            <div className="mb-3 flex items-center justify-between font-mono text-xs text-slate-300">
              <span>
                {time(elapsed)} /{" "}
                {duration ? time(duration) : "--:--"}
              </span>

              <span>
                FRAME — · TIME {time(elapsed)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">

              {/* START */}
              <button
                type="button"
                onClick={start}
                disabled={running}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ▶ Start AI Demo
              </button>

              {/* PAUSE */}
              <Button
                size="sm"
                variant="secondary"
                onClick={pause}
                disabled={!running}
              >
                <Pause data-icon="inline-start" />
                Pause
              </Button>

              {/* STOP */}
              <Button
                size="sm"
                variant="outline"
                onClick={stop}
              >
                <Square data-icon="inline-start" />
                Stop
              </Button>
            </div>
          </div>
        </div>

        {/* VIDEO STATUS */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-4 text-xs">
          <span className="text-slate-400">
            AI MODE:{" "}
            <strong className="text-violet-300">
              DEMO / SIMULATED AI INFERENCE
            </strong>
          </span>

          <span className="text-slate-500">
            {latest
              ? `Event at ${formatTime(latest.timestamp)}`
              : "No detection in current frame"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

/* =========================================================
   DETECTION EVIDENCE
========================================================= */

const detectionEvidence = [
  {
    title: "Longitudinal crack detection",
    label: "RDD Norway road surface set",
    confidence: "92%",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QIDLxkEdvmliB9I2Ou87t4wxplqWzn.png",
  },
  {
    title: "Pothole cluster detection",
    label: "Damaged rural road segment",
    confidence: "89%",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9h7zG5u6xVN5skurEK7o5KXpLOv1jc.png",
  },
  {
    title: "Road damage detection",
    label: "Potholes and standing water",
    confidence: "95%",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vEclHrj1eFaiEg3dDYxutbIafnJtpW.png",
  },
]

function DetectionEvidence() {
  return (
    <section className="mt-4">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[.2em] text-violet-300">
            Detection evidence
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-100">
            Road condition examples
          </h2>
        </div>

        <p className="text-xs text-slate-500">
          Reference frames from the vision model dataset
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {detectionEvidence.map((item) => (
          <Card
            key={item.title}
            className="overflow-hidden border-white/10 bg-[#111c31]"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
              <img
                src={item.image}
                alt={item.title}
                className="size-full object-cover"
                loading="lazy"
              />

              <Badge className="absolute left-3 top-3 border-cyan-300/40 bg-cyan-400/90 text-slate-950">
                {item.confidence} confidence
              </Badge>
            </div>

            <CardContent className="p-4">
              <p className="text-sm font-medium text-slate-100">
                {item.title}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {item.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

/* =========================================================
   MAIN AI COMMAND CENTER
========================================================= */

export function AICommandCenter() {
  const [detectionResults, setDetectionResults] = useState<
    Array<{
      frame: number
      class: number
      confidence: number
      x: number
      y: number
      width: number
      height: number
    }>
  >([])

  /* =======================================================
     LOAD YOLO DETECTION DATA
  ======================================================= */

  useEffect(() => {
    fetch("/detections.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Detection data error: ${response.status}`
          )
        }

        return response.json()
      })
      .then((data) => {
        const results = Array.isArray(data) ? data : []

        console.log(
          "✅ DETECTION RESULTS LOADED:",
          results.length
        )

        setDetectionResults(results)
      })
      .catch((error) => {
        console.error(
          "❌ Failed to load detection results:",
          error
        )
      })
  }, [])

  const {
    events,
    alerts,
    counts,
    addEvent,
    acknowledgeAlert,
  } = useAIDetectionState()

  const [latest, setLatest] =
    useState<AIDetectionEvent>()

  const onDetection = useCallback(
    (event: AIDetectionEvent) => {
      addEvent(event)
      setLatest(event)
    },
    [addEvent]
  )

  const demo = useAIDemonstration(onDetection)

  const markers = useMemo(
    () => events.slice(0, 10).map(aiMarker),
    [events]
  )

  return (
    <main className="min-h-screen bg-[#0b1220] text-slate-100">
      <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[.22em] text-violet-300">
              <Bot className="size-3" />
              Operations / computer vision
            </p>

            <h1 className="text-3xl font-semibold">
              AI Mobility Sensing
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Mobile road intelligence for the Tracko operations network.
            </p>
          </div>

          <Badge className="border-violet-400/30 bg-violet-500/15 text-violet-200">
            DEMO / SIMULATED AI INFERENCE
          </Badge>
        </header>

        {/* =================================================
            TOP STATS
        ================================================= */}

        <section className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["AI buses online", "3 / 4"],
            ["Events detected today", counts.events],
            ["Potholes detected", counts.potholes],
            ["Active AI alerts", counts.alerts],
          ].map(([label, value]) => (
            <Card
              key={String(label)}
              className="border-white/10 bg-[#111c31]"
            >
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  {label}
                </p>

                <p className="mt-2 text-3xl font-semibold text-slate-100">
                  {value}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* =================================================
            VIDEO + MAP
        ================================================= */}

        <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">

          <VideoFeed
            status={demo.status}
            running={demo.isRunning}
            elapsed={demo.elapsed}
            onStart={demo.start}
            onPause={demo.pause}
            onStop={demo.stop}
            onTime={demo.onVideoTime}
            latest={latest}
          />

          <Card className="overflow-hidden border-white/10 bg-[#111c31]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="size-4 text-blue-300" />
                Tracko incident map
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <GoogleMap
                center={aiLocations.center}
                zoom={12}
                markers={markers}
                height="420px"
                theme="dark"
                showTrafficLayer
                onMarkerClick={(marker) =>
                  setLatest(marker.aiDetectionData)
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* =================================================
            AI DETECTION RESULTS
        ================================================= */}

        <Card className="mt-4 border-white/10 bg-[#111c31]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Bot className="size-4 text-violet-300" />
                AI Detection Results
              </span>

              <Badge className="border-emerald-400/30 bg-emerald-500/15 text-emerald-300">
                {detectionResults.length} DETECTIONS
              </Badge>
            </CardTitle>

            <p className="text-xs text-slate-500">
              YOLO-based road condition detections from the dashcam dataset
            </p>
          </CardHeader>

          <CardContent>
            {detectionResults.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[.03] p-6 text-center">
                <p className="text-sm text-slate-400">
                  Loading detection results...
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                {detectionResults.slice(0, 12).map(
                  (detection, index) => {

                    const severity =
                      detection.confidence >= 0.75
                        ? "HIGH"
                        : detection.confidence >= 0.5
                          ? "MEDIUM"
                          : "LOW"

                    return (
                      <div
                        key={`${detection.frame}-${index}`}
                        className="rounded-xl border border-white/10 bg-white/[.03] p-4"
                      >

                        {/* CARD HEADER */}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="size-4 text-orange-300" />

                            <span className="text-sm font-medium text-slate-100">
                              Pothole Detected
                            </span>
                          </div>

                          <Badge
                            className={
                              severity === "HIGH"
                                ? "border-rose-400/30 bg-rose-500/15 text-rose-300"
                                : severity === "MEDIUM"
                                  ? "border-orange-400/30 bg-orange-500/15 text-orange-300"
                                  : "border-yellow-400/30 bg-yellow-500/15 text-yellow-300"
                            }
                          >
                            {severity}
                          </Badge>
                        </div>

                        {/* CARD DATA */}

                        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">

                          {/* CONFIDENCE */}

                          <div>
                            <p className="text-slate-500">
                              Confidence
                            </p>

                            <p className="mt-1 font-semibold text-orange-300">
                              {(
                                detection.confidence * 100
                              ).toFixed(1)}
                              %
                            </p>
                          </div>

                          {/* FRAME */}

                          <div>
                            <p className="text-slate-500">
                              Frame
                            </p>

                            <p className="mt-1 font-mono text-blue-300">
                              #{detection.frame}
                            </p>
                          </div>

                          {/* OBJECT CLASS */}

                          <div>
                            <p className="text-slate-500">
                              Object Class
                            </p>

                            <p className="mt-1 text-slate-200">
                              {detection.class}
                            </p>
                          </div>

                          {/* STATUS */}

                          <div>
                            <p className="text-slate-500">
                              Status
                            </p>

                            <p className="mt-1 text-emerald-300">
                              DETECTED
                            </p>
                          </div>

                          {/* GPS LOCATION */}

                          <div className="col-span-2 border-t border-white/10 pt-3">

                            <div className="flex items-start gap-2">

                              <MapPin className="mt-0.5 size-4 text-cyan-300" />

                              <div>
                                <p className="text-slate-500">
                                  GPS Location
                                </p>

                                <p className="mt-1 font-mono text-cyan-300">
                                  {DEMO_LOCATION.latitude.toFixed(4)},{" "}
                                  {DEMO_LOCATION.longitude.toFixed(4)}
                                </p>

                                <p className="mt-1 text-[10px] font-medium text-emerald-300">
                                  ● LOCATION SYNCED
                                </p>
                              </div>

                            </div>

                          </div>

                        </div>

                        {/* BUS INFO */}

                        <div className="mt-3 rounded-lg border border-blue-400/10 bg-blue-500/5 px-3 py-2">

                          <div className="flex items-center justify-between text-[10px]">

                            <span className="text-slate-500">
                              SOURCE BUS
                            </span>

                            <span className="font-mono text-blue-300">
                              {bus.busId}
                            </span>

                          </div>

                          <div className="mt-1 flex items-center justify-between text-[10px]">

                            <span className="text-slate-500">
                              ROUTE
                            </span>

                            <span className="text-slate-300">
                              {bus.routeId} · {bus.routeName}
                            </span>

                          </div>

                        </div>

                      </div>
                    )
                  }
                )}

              </div>
            )}
          </CardContent>
        </Card>

        {/* =================================================
            HISTORY + ALERTS
        ================================================= */}

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">

          {/* HISTORY */}

          <Card className="border-white/10 bg-[#111c31]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Radio className="size-4 text-violet-300" />
                AI detection history
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">

                <table className="w-full min-w-[620px] text-left text-xs">

                  <thead className="border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="pb-3">Event</th>
                      <th className="pb-3">Time</th>
                      <th className="pb-3">Detection</th>
                      <th className="pb-3">Confidence</th>
                      <th className="pb-3">Severity</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {events.map((event) => (
                      <tr
                        key={event.id}
                        className="border-b border-white/5"
                      >

                        <td className="py-3 font-mono text-blue-300">
                          {event.id}
                        </td>

                        <td className="py-3 text-slate-400">
                          {formatTime(event.timestamp)}
                        </td>

                        <td className="py-3 text-slate-200">
                          {formatDetectionType(
                            event.eventType
                          )}
                        </td>

                        <td className="py-3 text-orange-300">
                          {confidenceLabel(
                            event.confidence
                          )}
                        </td>

                        <td className="py-3 text-rose-300">
                          {event.severity}
                        </td>

                        <td className="py-3 text-slate-400">
                          {event.status}
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </CardContent>
          </Card>

          {/* ALERTS */}

          <Card className="border-white/10 bg-[#111c31]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="size-4 text-rose-300" />
                AI alerts
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">

              {alerts.slice(0, 6).map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-xl border border-white/10 bg-white/[.03] p-3"
                >

                  <div className="flex items-start justify-between gap-3">

                    <p className="text-sm text-slate-200">
                      {alert.message}
                    </p>

                    <span className="text-[10px] text-slate-500">
                      {formatTime(alert.createdAt)}
                    </span>

                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 h-7 text-xs"
                    onClick={() =>
                      acknowledgeAlert(alert.id)
                    }
                    disabled={alert.acknowledged}
                  >
                    {alert.acknowledged
                      ? "Acknowledged"
                      : "Acknowledge"}
                  </Button>

                </div>
              ))}

            </CardContent>
          </Card>

        </div>

        {/* =================================================
            RESET
        ================================================= */}

        <div className="mt-4 flex justify-end">

          <Button
            variant="outline"
            size="sm"
            onClick={demo.stop}
          >
            <RotateCcw data-icon="inline-start" />
            Reset demo
          </Button>

        </div>

        {/* =================================================
            EVIDENCE
        ================================================= */}

        <DetectionEvidence />

      </div>
    </main>
  )
}