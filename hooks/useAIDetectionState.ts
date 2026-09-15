"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AIDetectionEvent, AIAlert, alertsFrom, historicalDetections, newAlert, safeEvent } from '@/lib/ai/types'

export function useAIDetectionState() {
  const [events, setEvents] = useState<AIDetectionEvent[]>([])
  const [alerts, setAlerts] = useState<AIAlert[]>([])
  useEffect(() => {
    setEvents(historicalDetections)
    setAlerts(alertsFrom(historicalDetections))
  }, [])
  const addEvent = useCallback((event: AIDetectionEvent) => { const next = safeEvent(event); setEvents((current) => [next, ...current]); setAlerts((current) => [newAlert(next), ...current]) }, [])
  const updateEvent = useCallback((id: string, updates: Partial<AIDetectionEvent>) => setEvents((current) => current.map((event) => event.id === id ? { ...event, ...updates } : event)), [])
  const acknowledgeAlert = useCallback((id: string) => setAlerts((current) => current.map((alert) => alert.id === id ? { ...alert, acknowledged: true } : alert)), [])
  const counts = useMemo(() => ({ events: events.length + 12, potholes: events.filter((event) => event.eventType === 'pothole').length + 8, alerts: alerts.filter((alert) => !alert.acknowledged).length }), [events, alerts])
  return { events, alerts, counts, addEvent, updateEvent, acknowledgeAlert }
}
