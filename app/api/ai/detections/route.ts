import { NextResponse } from 'next/server'
import { createDetection, detectionTypes, normalizeConfidence, normalizeSeverity, normalizeEventType, isValidCoordinate } from '@/lib/ai/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const required = ['eventType', 'confidence', 'busId', 'routeId', 'latitude', 'longitude', 'frameNumber', 'severity']
    if (required.some((key) => body[key] === undefined || body[key] === null)) return NextResponse.json({ success: false, error: 'Missing required detection fields' }, { status: 400 })
    const latitude = Number(body.latitude); const longitude = Number(body.longitude); const confidence = Number(body.confidence)
    if (!isValidCoordinate(latitude, longitude) || !Number.isFinite(confidence) || confidence < 0 || confidence > 1) return NextResponse.json({ success: false, error: 'Invalid coordinates or confidence' }, { status: 400 })
    const detection = createDetection({ ...body, eventType: normalizeEventType(String(body.eventType)), confidence: normalizeConfidence(confidence), severity: normalizeSeverity(String(body.severity)), latitude, longitude, frameNumber: Number(body.frameNumber) })
    return NextResponse.json({ success: true, id: detection.id, detection }, { status: 201 })
  } catch { return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 }) }
}
