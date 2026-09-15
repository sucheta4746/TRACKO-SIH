import type { DetectionFrame, YOLODetection } from './types'

export async function analyzeFrame(frame: Blob, signal?: AbortSignal): Promise<DetectionFrame> {
  const endpoint = process.env.NEXT_PUBLIC_AI_INFERENCE_URL
  if (!endpoint) throw new Error('YOLO inference endpoint is not configured')
  const response = await fetch(endpoint, { method: 'POST', body: frame, signal, headers: { 'Content-Type': 'image/jpeg' } })
  if (!response.ok) throw new Error(`YOLO server returned ${response.status}`)
  const payload = await response.json() as DetectionFrame
  return { frame: Number(payload.frame), timestamp: Number(payload.timestamp), detections: Array.isArray(payload.detections) ? payload.detections : [] }
}

export function normalizeDetection(detection: YOLODetection) {
  return { ...detection, confidence: Math.min(1, Math.max(0, Number(detection.confidence))), x: Math.min(1, Math.max(0, Number(detection.x))), y: Math.min(1, Math.max(0, Number(detection.y))), width: Math.min(1, Math.max(0, Number(detection.width))), height: Math.min(1, Math.max(0, Number(detection.height))) }
}

export const hasLiveInference = Boolean(process.env.NEXT_PUBLIC_AI_INFERENCE_URL)
export const inferenceEndpointLabel = hasLiveInference ? 'YOLO Inference Connected' : 'Simulated AI Inference'
