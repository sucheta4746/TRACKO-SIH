"use client"
import { useCallback, useEffect, useRef, useState } from 'react'
import { createDetection, demoDetections, type AIProcessingStatus } from '@/lib/ai/types'

export function useAIDemonstration(onDetection: (event: ReturnType<typeof createDetection>) => void) {
  const [isRunning, setIsRunning] = useState(false)
  const [status, setStatus] = useState<AIProcessingStatus>('READY')
  const [elapsed, setElapsed] = useState(0)
  const fired = useRef(new Set<number>())
  const stop = useCallback(() => { setIsRunning(false); setStatus('READY'); setElapsed(0); fired.current.clear() }, [])
  const onVideoTime = useCallback((seconds: number) => { setElapsed(seconds); const index = [5, 11, 17].findIndex((at) => seconds >= at && !fired.current.has(at)); if (index < 0) return; const at = [5, 11, 17][index]; fired.current.add(at); const scenario = demoDetections[index]; onDetection(createDetection({ ...scenario, eventType: 'pothole', timestamp: new Date().toISOString() })); setStatus('DETECTION_FOUND') }, [onDetection])
  const start = useCallback(() => { fired.current.clear(); setIsRunning(true); setStatus('PROCESSING') }, [])
  const pause = useCallback(() => { setIsRunning(false); setStatus('READY') }, [])
  useEffect(() => {
    if (!isRunning) return
    const timer = setInterval(() => {
      setElapsed((current) => {
        const next = current + 1
        onVideoTime(next)
        if (next >= 20) {
          setIsRunning(false)
          setStatus('READY')
        }
        return next
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning, onVideoTime])
  return { isRunning, status, elapsed, start, pause, stop, onVideoTime }
}
