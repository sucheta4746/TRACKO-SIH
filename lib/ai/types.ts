export type DetectionEventType = 'pothole' | 'construction' | 'road_obstruction' | 'barricade' | 'abandoned_vehicle' | 'debris' | 'waterlogging'
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type AIProcessingStatus = 'READY' | 'CONNECTING' | 'PROCESSING' | 'DETECTION_FOUND' | 'NO_DETECTION' | 'YOLO_OFFLINE' | 'ERROR'

export interface YOLODetection { class: DetectionEventType | string; confidence: number; x: number; y: number; width: number; height: number; imageUrl?: string }
export interface DetectionFrame { frame: number; timestamp: number; detections: YOLODetection[] }
export type DetectionStatus = 'NEW' | 'UNVERIFIED' | 'VERIFIED' | 'ASSIGNED' | 'RESOLVED' | 'REJECTED'
export type BusAIStatus = 'ONLINE' | 'PROCESSING' | 'OFFLINE' | 'ERROR'

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface AIDetectionEvent {
  id: string
  eventType: DetectionEventType
  confidence: number
  busId: string
  routeId: string
  timestamp: string
  latitude: number
  longitude: number
  imageUrl: string
  frameNumber: number
  severity: Severity
  status: DetectionStatus
  box?: BoundingBox
  verifiedBy?: string
  notes?: string
  locationLabel?: string
  roadName?: string
  capturedAt?: string
  source?: string
  laneImpact?: string
}

export interface AIBus {
  busId: string
  aiSensorStatus: BusAIStatus
  lastDetection?: DetectionEventType
  lastDetectionTime?: string
  lastLocation: { lat: number; lng: number }
  connectionStatus: 'Connected' | 'Disconnected'
  currentRoute?: string
}

export interface AIAlert {
  id: string
  detectionEventId: string
  severity: Severity
  message: string
  createdAt: string
  acknowledged: boolean
}

export interface DetectionScenario extends AIDetectionEvent {
  locationLabel: string
}

export interface AIMarker {
  id: string
  lat: number
  lng: number
  type: 'ai-detection'
  label: string
  status: string
  aiDetectionData: AIDetectionEvent
}

export function formatDetectionType(type: DetectionEventType) {
  return type.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function severityTone(severity: Severity) {
  return { LOW: 'success', MEDIUM: 'warning', HIGH: 'danger', CRITICAL: 'danger' }[severity]
}

export function detectionTone(type: DetectionEventType) {
  return { pothole: 'bg-orange-500', construction: 'bg-amber-500', road_obstruction: 'bg-red-500', barricade: 'bg-purple-500', abandoned_vehicle: 'bg-blue-500', debris: 'bg-yellow-500', waterlogging: 'bg-cyan-500' }[type]
} 

export function createDetection(input: Partial<AIDetectionEvent> & Pick<AIDetectionEvent, 'eventType' | 'confidence' | 'frameNumber' | 'severity' | 'latitude' | 'longitude'>): AIDetectionEvent {
  return { id: `AI-${Math.floor(10000 + Math.random() * 89999)}`, busId: 'TRK-102', routeId: 'R-17', timestamp: new Date().toISOString(), imageUrl: '/demo/pothole2.png', status: 'UNVERIFIED', ...input }
} 

export const demoDetections: DetectionScenario[] = [
  { ...createDetection({ eventType: 'pothole', confidence: .92, frameNumber: 184, severity: 'HIGH', latitude: 30.7046, longitude: 76.7179, box: { x: .42, y: .65, width: .18, height: .15 }, locationLabel: 'Sector 17 · Madhya Marg', roadName: 'Madhya Marg', capturedAt: '2026-09-15T10:32:14+05:30', source: 'TRK-102 front camera', laneImpact: 'Left lane affected' }), locationLabel: 'Sector 17 · Madhya Marg' },
  { ...createDetection({ eventType: 'construction', confidence: .88, frameNumber: 362, severity: 'MEDIUM', latitude: 30.7112, longitude: 76.7254, box: { x: .24, y: .48, width: .22, height: .24 }, locationLabel: 'Sector 22 · Himalaya Marg', roadName: 'Himalaya Marg', capturedAt: '2026-09-15T10:35:48+05:30', source: 'TRK-102 front camera', laneImpact: 'Work zone narrowing two lanes' }), locationLabel: 'Sector 22 · Himalaya Marg' },
  { ...createDetection({ eventType: 'road_obstruction', confidence: .94, frameNumber: 581, severity: 'CRITICAL', latitude: 30.6948, longitude: 76.8012, box: { x: .56, y: .58, width: .2, height: .2 }, locationLabel: 'Industrial Area · Phase 2', roadName: 'Phase 2 Industrial Road', capturedAt: '2026-09-15T10:41:26+05:30', source: 'TRK-102 front camera', laneImpact: 'Road blocked' }), locationLabel: 'Industrial Area · Phase 2' },
]

export const fleet: AIBus[] = [
  { busId: 'TRK-102', aiSensorStatus: 'PROCESSING', lastDetection: 'pothole', lastDetectionTime: '2 min ago', lastLocation: { lat: 30.7046, lng: 76.7179 }, connectionStatus: 'Connected', currentRoute: 'R-17 · Central Loop' },
  { busId: 'TRK-087', aiSensorStatus: 'ONLINE', lastDetection: 'construction', lastDetectionTime: '18 min ago', lastLocation: { lat: 30.7112, lng: 76.7254 }, connectionStatus: 'Connected', currentRoute: 'R-04 · North Corridor' },
  { busId: 'TRK-114', aiSensorStatus: 'ONLINE', lastDetectionTime: '1 hr ago', lastLocation: { lat: 30.6948, lng: 76.8012 }, connectionStatus: 'Connected', currentRoute: 'R-21 · Industrial' },
  { busId: 'TRK-091', aiSensorStatus: 'OFFLINE', lastLocation: { lat: 30.698, lng: 76.735 }, connectionStatus: 'Disconnected', currentRoute: 'R-09 · Airport Link' },
]

export const historicalDetections: AIDetectionEvent[] = [
  ...demoDetections,
  createDetection({ eventType: 'debris', confidence: .81, frameNumber: 733, severity: 'LOW', latitude: 30.69, longitude: 76.73, busId: 'TRK-087', routeId: 'R-04', status: 'VERIFIED', notes: 'Cleared by municipal response team' }),
  createDetection({ eventType: 'waterlogging', confidence: .86, frameNumber: 911, severity: 'HIGH', latitude: 30.718, longitude: 76.74, busId: 'TRK-114', routeId: 'R-21', status: 'ASSIGNED' }),
]

export const alertsFrom = (events: AIDetectionEvent[]): AIAlert[] => events.filter((event) => event.severity === 'HIGH' || event.severity === 'CRITICAL').map((event, index) => ({ id: `ALT-${index + 1}`, detectionEventId: event.id, severity: event.severity, message: `${formatDetectionType(event.eventType)} detected on ${event.routeId} near ${event.busId}`, createdAt: event.timestamp, acknowledged: false }))

export const aiLocations = { center: { lat: 30.7046, lng: 76.7179 }, zoom: 12 }

export const pipelineSteps = ['BUS DASHCAM', 'VIDEO FRAME', 'YOLO VISION', 'EVENT DETECTED', 'GPS + TIMESTAMP', 'TRACKO API', 'CENTRAL', 'ALERT / MAP / ANALYTICS']

export const analyticsData = [
  { day: 'Mon', potholes: 8, obstructions: 5, construction: 3 }, { day: 'Tue', potholes: 12, obstructions: 7, construction: 5 }, { day: 'Wed', potholes: 10, obstructions: 9, construction: 4 }, { day: 'Thu', potholes: 16, obstructions: 6, construction: 8 }, { day: 'Fri', potholes: 14, obstructions: 11, construction: 7 }, { day: 'Sat', potholes: 9, obstructions: 4, construction: 3 }, { day: 'Sun', potholes: 7, obstructions: 3, construction: 2 },
]

export const severityScale: Severity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
export const detectionTypes: DetectionEventType[] = ['pothole', 'construction', 'road_obstruction', 'debris', 'waterlogging']
export const statuses: DetectionStatus[] = ['NEW', 'UNVERIFIED', 'VERIFIED', 'ASSIGNED', 'RESOLVED']

export type MapMarker = { id: string; lat: number; lng: number; type: 'vehicle' | 'incident' | 'intersection' | 'bus' | 'school' | 'ai-detection'; label?: string; congestion?: number; status?: string; aiDetectionData?: AIDetectionEvent }

export const aiMarker = (event: AIDetectionEvent): MapMarker => ({ id: event.id, lat: event.latitude, lng: event.longitude, type: 'ai-detection', label: `${formatDetectionType(event.eventType)} · ${Math.round(event.confidence * 100)}%`, status: event.severity, aiDetectionData: event })

export const aiSeverityColor = (severity: Severity) => ({ LOW: '#22c55e', MEDIUM: '#facc15', HIGH: '#f97316', CRITICAL: '#ef4444' }[severity])

export function formatTime(value: string) { return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(new Date(value)) }
export function formatDateTime(value: string) { return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) }

export const aiKpiDefaults = { busesOnline: 3, eventsToday: 18, potholes: 11, activeAlerts: 3 }

export const demoFrame = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#101a2d"/><stop offset="1" stop-color="#263b5b"/></linearGradient></defs><rect width="900" height="500" fill="url(#g)"/><path d="M0 390 Q230 330 450 370 T900 320 V500 H0Z" fill="#18263b"/><path d="M0 410 Q230 350 450 390 T900 340" fill="none" stroke="#7183a5" stroke-width="7" stroke-dasharray="28 20"/><path d="M420 400 l45 -70 42 70z" fill="#f97316" opacity=".85"/><circle cx="444" cy="386" r="34" fill="none" stroke="#fb923c" stroke-width="4" opacity=".8"/><text x="34" y="54" fill="#e2e8f0" font-family="Arial" font-size="18" letter-spacing="3">TRK-102 · FRONT CAMERA</text><text x="34" y="84" fill="#94a3b8" font-family="Arial" font-size="14">SECTOR 17 / 10:32:14</text></svg>`)} `
export const mockVideoSource = ''

export const getRouteLabel = (bus: AIBus) => bus.currentRoute || 'No active route'
export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
export const alertCount = (events: AIDetectionEvent[]) => events.filter((event) => event.severity === 'HIGH' || event.severity === 'CRITICAL').length
export const confidenceLabel = (confidence: number) => `${Math.round(confidence * 100)}%`
export const eventId = (event: AIDetectionEvent) => event.id
export const isActiveEvent = (event: AIDetectionEvent) => event.status !== 'RESOLVED' && event.status !== 'REJECTED'
export const severityOrder = (severity: Severity) => severityScale.indexOf(severity)
export const sortBySeverity = (events: AIDetectionEvent[]) => [...events].sort((a, b) => severityOrder(b.severity) - severityOrder(a.severity))
export const detectionSummary = (events: AIDetectionEvent[]) => detectionTypes.map((type) => ({ type, count: events.filter((event) => event.eventType === type).length }))
export const routeOptions = ['All routes', 'R-17', 'R-04', 'R-21']
export const busOptions = ['All buses', 'TRK-102', 'TRK-087', 'TRK-114']
export const statusLabel = (status: DetectionStatus) => capitalize(status)
export const severityLabel = (severity: Severity) => capitalize(severity)
export const typeLabel = (type: DetectionEventType) => formatDetectionType(type)
export const aiModeLabel = 'DEMO / SIMULATED AI INFERENCE'
export const aiVersion = 'YOLOv8 · Edge Vision'
export const confidenceThreshold = .75
export const demoDurationSeconds = 20
export const activeFleetCount = fleet.filter((bus) => bus.aiSensorStatus !== 'OFFLINE').length
export const criticalDetection = (events: AIDetectionEvent[]) => events.find((event) => event.severity === 'CRITICAL')
export const lastDetection = (events: AIDetectionEvent[]) => events.at(-1)
export const eventAge = (timestamp: string) => `${Math.max(1, Math.round((Date.now() - new Date(timestamp).getTime()) / 60000))} min ago`
export const markerPopupText = (event: AIDetectionEvent) => `${typeLabel(event.eventType)} · ${confidenceLabel(event.confidence)} · ${event.busId}`
export const hasHighSeverity = (event: AIDetectionEvent) => event.severity === 'HIGH' || event.severity === 'CRITICAL'
export const eventCoordinates = (event: AIDetectionEvent) => `${event.latitude.toFixed(4)}, ${event.longitude.toFixed(4)}`
export const demoScenarioAt = (index: number) => demoDetections[index % demoDetections.length]
export const pipelineCaption = 'Every bus becomes a mobile road-intelligence unit.'
export const liveFeedTitle = 'Live AI sensing feed'
export const emptyFilter = 'All'
export const defaultBusId = 'TRK-102'
export const defaultRouteId = 'R-17'
export const apiPath = '/api/ai/detections'
export const supportedModes = ['DEMO', 'REAL'] as const
export type AIMode = typeof supportedModes[number]
export const defaultMode: AIMode = 'DEMO'
export const getModeLabel = (mode: AIMode) => mode === 'DEMO' ? aiModeLabel : 'REAL AI / YOLO API'
export const isDetection = (value: unknown): value is AIDetectionEvent => !!value && typeof value === 'object' && 'eventType' in value && 'confidence' in value
export const normalizeConfidence = (value: number) => Math.min(1, Math.max(0, value))
export const normalizeSeverity = (value: string): Severity => severityScale.includes(value as Severity) ? value as Severity : 'MEDIUM'
export const normalizeStatus = (value: string): DetectionStatus => statuses.includes(value as DetectionStatus) ? value as DetectionStatus : 'NEW'
export const normalizeEventType = (value: string): DetectionEventType => detectionTypes.includes(value as DetectionEventType) ? value as DetectionEventType : 'road_obstruction'
export const safeEvent = (event: AIDetectionEvent) => ({ ...event, confidence: normalizeConfidence(event.confidence), severity: normalizeSeverity(event.severity), status: normalizeStatus(event.status), eventType: normalizeEventType(event.eventType) })
export const csvHeaders = ['Event ID', 'Time', 'Bus', 'Detection', 'Confidence', 'Location', 'Severity', 'Status']
export const detectionCount = (events: AIDetectionEvent[], type: DetectionEventType) => events.filter((event) => event.eventType === type).length
export const routeCount = (events: AIDetectionEvent[], route: string) => events.filter((event) => event.routeId === route).length
export const severityCount = (events: AIDetectionEvent[], severity: Severity) => events.filter((event) => event.severity === severity).length
export const statusCount = (events: AIDetectionEvent[], status: DetectionStatus) => events.filter((event) => event.status === status).length
export const currentIso = () => new Date().toISOString()
export const newAlert = (event: AIDetectionEvent): AIAlert => ({ id: `ALT-${Date.now()}`, detectionEventId: event.id, severity: event.severity, message: `${typeLabel(event.eventType)} detected on ${event.routeId}`, createdAt: currentIso(), acknowledged: false })
export const busStatusLabel = (status: BusAIStatus) => capitalize(status)
export const busConnectionLabel = (status: AIBus['connectionStatus']) => status
export const chartColors = { potholes: '#fb923c', obstructions: '#ef4444', construction: '#facc15' }
export const pageTitle = 'AI Mobility Sensing'
export const pageDescription = 'Mobile AI sensing for safer, smarter streets.'
export const mapLayerLabel = 'AI detections'
export const noDetectionLabel = 'No detection in current frame'
export const processingLabel = 'Processing video frame'
export const readyLabel = 'Ready for AI inference'
export const errorLabel = 'Inference error'
export const detectionFoundLabel = 'Detection found'
export const systemHealth = 99.2
export const totalFrames = 12480
export const averageLatency = 184
export const modelAccuracy = 91.8
export const responseSla = '4m 12s'
export const resolvedThisWeek = 42
export const coverageKm = 184.6
export const activeRoutes = 12
export const sensorUptime = '99.2%'
export const defaultMapHeight = '440px'
export const demoVideoPoster = demoFrame
export const apiReady = Boolean(process.env.AI_INFERENCE_API_URL)
export const demoEnabled = process.env.AI_DEMO_MODE !== 'false'
export const isHighSeverity = (severity: Severity) => severity === 'HIGH' || severity === 'CRITICAL'
export const orderedEvents = (events: AIDetectionEvent[]) => [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
export const detectionFilterValues = { types: detectionTypes, severities: severityScale, statuses }
export const demoEventMessage = (event: AIDetectionEvent) => `${typeLabel(event.eventType)} identified with ${confidenceLabel(event.confidence)} confidence.`
export const fleetOnlineLabel = `${activeFleetCount}/${fleet.length} online`
export const systemLabel = 'TRACKO AI COMMAND CENTRE'
export const aiAccent = '#8b5cf6'
export const borderColor = '#263552'
export const panelColor = '#111c31'
export const mutedColor = '#8291ae'
export const primaryColor = '#5b8def'
export const footerLabel = 'TRACKO Operations Network'
export const supportedDetectionsLabel = '7 detection classes'
export const modeDescription = 'Synthetic frames and deterministic scenarios for evaluation'
export const productionDescription = 'Connect AI_INFERENCE_API_URL to enable live YOLO inference'
export const inputSchemaFields = ['eventType', 'confidence', 'busId', 'routeId', 'timestamp', 'latitude', 'longitude', 'imageUrl', 'frameNumber', 'severity']
export const lastUpdatedLabel = 'Updated just now'
export const timezone = 'Asia/Kolkata'
export const sourceLabel = 'Edge dashcam telemetry'
export const moduleVersion = 'v0.9.0'
export const buildLabel = 'Prototype build'
export const routeColor = '#60a5fa'
export const warningColor = '#fbbf24'
export const dangerColor = '#fb7185'
export const successColor = '#34d399'
export const violetColor = '#a78bfa'
export const slateColor = '#94a3b8'
export const aiModuleNavItem = { name: 'AI Mobility Sensing', path: '/ai-sensing', icon: 'zap' }
export const navIcon = 'zap'
export const moduleTag = 'AI / CV'
export const commandCenterPath = '/ai-sensing'
export const dashboardRole = 'Traffic Centre'
export const lastSync = '14:38:08 IST'
export const systemStatus = 'Operational'
export const eventTypeIcon = (type: DetectionEventType) => type === 'pothole' ? 'CircleAlert' : type === 'construction' ? 'HardHat' : 'TriangleAlert'
export const sortNewest = (events: AIDetectionEvent[]) => orderedEvents(events)
export const mapMarkerType = 'ai-detection' as const
export const defaultConfidence = .85
export const minConfidence = 0
export const maxConfidence = 1
export const confidenceStep = .01
export const tablePageSize = 8
export const maxDemoEvents = demoDetections.length
export const mapCenterLabel = 'Chandigarh, India'
export const mapProviderLabel = 'Google Maps traffic layer'
export const modelMode = 'YOLO vision inference'
export const dataRetention = '30 days'
export const notificationLabel = 'AI alert notifications'
export const mobileFeedLabel = 'Mobile sensing feed'
export const eventWorkflow = ['NEW', 'UNVERIFIED', 'VERIFIED', 'ASSIGNED', 'RESOLVED'] as const
export const fleetStatuses = ['ONLINE', 'PROCESSING', 'OFFLINE', 'ERROR'] as const
export const eventStatuses = statuses
export const locationLabel = (event: AIDetectionEvent) => `${event.latitude.toFixed(3)}°, ${event.longitude.toFixed(3)}°`
export const demoScenarioLabels = demoDetections.map((event) => event.locationLabel)
export const detectionLegend = severityScale.map((severity) => ({ severity, color: aiSeverityColor(severity) }))
export const typeLegend = detectionTypes.map((type) => ({ type, label: typeLabel(type) }))
export const getAlertMessage = (event: AIDetectionEvent) => `${typeLabel(event.eventType)} detected near ${event.routeId}`
export const mockLatency = (frame: number) => 100 + (frame % 130)
export const frameLabel = (frame: number) => `FRAME ${String(frame).padStart(4, '0')}`
export const busLabel = (bus: AIBus) => `${bus.busId} · ${bus.currentRoute?.split(' · ')[0] || 'No route'}`
export const routeLabel = (event: AIDetectionEvent) => event.routeId
export const detectionKey = (event: AIDetectionEvent) => `${event.id}-${event.frameNumber}`
export const markerAria = (event: AIDetectionEvent) => `${typeLabel(event.eventType)} at ${eventCoordinates(event)}`
export const canAcknowledge = (alert: AIAlert) => !alert.acknowledged
export const canResolve = (event: AIDetectionEvent) => event.status !== 'RESOLVED'
export const resolvedStatus: DetectionStatus = 'RESOLVED'
export const unverifiedStatus: DetectionStatus = 'UNVERIFIED'
export const newStatus: DetectionStatus = 'NEW'
export const criticalLabel = 'Critical road safety risk'
export const highLabel = 'High priority response'
export const mediumLabel = 'Monitor and assign'
export const lowLabel = 'Low priority'
export const statusOptions = ['All', ...statuses]
export const severityOptions = ['All', ...severityScale]
export const typeOptions = ['All', ...detectionTypes]
export const busFilterOptions = ['All', ...busOptions.slice(1)]
export const tabOptions = ['Overview', 'Detections', 'Fleet'] as const
export const analyticsMetricOptions = ['Events', 'Confidence', 'Response'] as const
export const themeRole = 'dark' as const
export const kpiLabels = ['AI buses online', 'Events detected today', 'Potholes detected', 'Active AI alerts']
export const allEvents = historicalDetections
export const routePath = (route: string) => `/traffic-centre/${route}`
export const isDemo = true
export const sourceMode = 'simulated'
export const moduleName = 'AI Mobility Sensing'
export const eventCountLabel = (count: number) => `${count} event${count === 1 ? '' : 's'}`
export const percentage = (value: number) => `${Math.round(value * 100)}%`
export const oneDecimal = (value: number) => value.toFixed(1)
export const stringOrDash = (value?: string) => value || '—'
export const defaultImageUrl = '/demo/pothole2.png'
export const commandCenterSubtitle = 'Buses become mobile AI sensing units for safer roads.'
export const demoCta = 'Start AI demo'
export const stopDemoCta = 'Stop demo'
export const liveCta = 'Live feed'
export const telemetryLabel = 'Telemetry online'
export const confidenceThresholdLabel = 'Confidence threshold 75%'
export const mapSignalLabel = 'Map signal synced'
export const allSystemsLabel = 'All systems operational'
export const eventStreamLabel = 'Detection event stream'
export const aiAlertLabel = 'AI safety alerts'
export const noAlertsLabel = 'No active alerts'
export const noEventsLabel = 'No matching detections'
export const noFleetLabel = 'No fleet records'
export const generatedAt = () => new Date().toLocaleTimeString('en-IN')
export const currentTimeLabel = () => new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())
export const isBrowser = typeof window !== 'undefined'
export const classNameForSeverity = (severity: Severity) => `severity-${severity.toLowerCase()}`
export const classNameForStatus = (status: DetectionStatus) => `status-${status.toLowerCase()}`
export const classNameForBusStatus = (status: BusAIStatus) => `bus-${status.toLowerCase()}`
export const modelLabel = 'YOLOv8n · 640px'
export const eventStoreLabel = 'Event store ready'
export const apiModeLabel = 'POST /api/ai/detections'
export const maxConfidenceLabel = '100%'
export const minConfidenceLabel = '0%'
export const defaultLocation = 'Chandigarh, India'
export const cityLabel = 'CHD / UT'
export const signalHealth = '98.7%'
export const queueDepth = 4
export const framesPerSecond = 8
export const averageConfidence = .89
export const dailyChange = '+22.4%'
export const alertChange = '-14.8%'
export const onlineChange = '+1'
export const potholeChange = '+18.2%'
export const aiNavDescription = 'Computer vision road intelligence'
export const pageEyebrow = 'OPERATIONS / COMPUTER VISION'
export const topBarLabel = 'AI command centre'
export const demoBadgeText = 'DEMO MODE'
export const inferenceBadgeText = 'SIMULATED'
export const realBadgeText = 'REAL API READY'
export const moreLabel = 'View all detections'
export const detailsLabel = 'View details'
export const acknowledgeLabel = 'Acknowledge'
export const resolveLabel = 'Mark resolved'
export const clearLabel = 'Clear'
export const closeLabel = 'Close'
export const openLabel = 'Open'
export const filterLabel = 'Filter events'
export const exportLabel = 'Export CSV'
export const searchPlaceholder = 'Search event ID, bus or route...'
export const confidenceSuffix = ' confidence'
export const liveBadge = 'LIVE'
export const offlineBadge = 'OFFLINE'
export const connectedBadge = 'CONNECTED'
export const processingBadge = 'PROCESSING'
export const readyBadge = 'READY'
export const alertBadge = 'ALERT'
export const verifiedBadge = 'VERIFIED'
export const unverifiedBadge = 'UNVERIFIED'
export const assignedBadge = 'ASSIGNED'
export const resolvedBadge = 'RESOLVED'
export const pageGrid = 'grid gap-4 lg:grid-cols-12'
export const panelRadius = 'rounded-2xl'
export const subtleText = 'text-slate-400'
export const strongText = 'text-slate-100'
export const isNotEmpty = (value: string) => value.trim().length > 0
export const routeTo = (path: string) => path
export const safeNumber = (value: number) => Number.isFinite(value) ? value : 0
export const safeString = (value: unknown) => typeof value === 'string' ? value : ''
export const isValidCoordinate = (lat: number, lng: number) => lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
export const detectionSchemaVersion = '1.0'
export const apiMethod = 'POST'
export const httpCreated = 201
export const httpBadRequest = 400
export const httpServerError = 500
export const versionLabel = 'AI sensing layer'
export const docsLabel = 'Production integration prepared'
export const modeToggleLabel = 'Inference mode'
export const modeToggleDescription = 'Switch between simulated demo and external YOLO API.'
export const defaultTableSort = 'newest'
export const routeGroup = 'ai-sensing'
export const iconName = 'Zap'
export const aiPageAccent = 'violet'
export const kpiIconNames = ['Cpu', 'ScanSearch', 'CircleDot', 'ShieldAlert']
export const eventBadgeClass = 'border-white/10 bg-white/5'
export const allGoodMessage = 'No critical events require action.'
export const sourceStatus = 'Connected to edge telemetry'
export const eventStatusSummary = (events: AIDetectionEvent[]) => `${events.filter((event) => event.status === 'UNVERIFIED').length} awaiting verification`
export const activeAlertSummary = (events: AIDetectionEvent[]) => `${alertCount(events)} priority alerts`
export const detectionTypeSummary = (events: AIDetectionEvent[]) => `${new Set(events.map((event) => event.eventType)).size} classes observed`
export const fleetSummary = `${activeFleetCount} sensing buses reporting`
export const currentDateLabel = () => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date())
export const isFuture = (timestamp: string) => new Date(timestamp).getTime() > Date.now()
export const sourceVersion = '1.0.0'
export const schemaName = 'AIDetectionEvent'
export const alertSeverity = (alert: AIAlert) => alert.severity
export const eventStatus = (event: AIDetectionEvent) => event.status
export const eventType = (event: AIDetectionEvent) => event.eventType
export const eventConfidence = (event: AIDetectionEvent) => event.confidence
export const eventBus = (event: AIDetectionEvent) => event.busId
export const eventRoute = (event: AIDetectionEvent) => event.routeId
export const eventTime = (event: AIDetectionEvent) => event.timestamp
export const eventLocation = (event: AIDetectionEvent) => ({ lat: event.latitude, lng: event.longitude })
export const isResolved = (event: AIDetectionEvent) => event.status === 'RESOLVED'
export const isCritical = (event: AIDetectionEvent) => event.severity === 'CRITICAL'
export const isVerified = (event: AIDetectionEvent) => event.status === 'VERIFIED'
export const isAssigned = (event: AIDetectionEvent) => event.status === 'ASSIGNED'
export const isNew = (event: AIDetectionEvent) => event.status === 'NEW'
export const isUnverified = (event: AIDetectionEvent) => event.status === 'UNVERIFIED'
export const isOffline = (bus: AIBus) => bus.aiSensorStatus === 'OFFLINE'
export const isOnline = (bus: AIBus) => bus.aiSensorStatus === 'ONLINE' || bus.aiSensorStatus === 'PROCESSING'
export const displayBusStatus = (bus: AIBus) => `${bus.aiSensorStatus} · ${bus.connectionStatus}`
export const totalFleet = fleet.length
export const totalEvents = historicalDetections.length
export const totalAlerts = alertCount(historicalDetections)
export const latestScenario = demoDetections[0]
export const firstScenario = demoDetections[0]
export const secondScenario = demoDetections[1]
export const thirdScenario = demoDetections[2]
export const featureList = ['Pothole detection', 'Construction awareness', 'Obstruction alerts', 'GPS-tagged evidence']
export const heroStatement = 'See the street before the street sees you.'
export const moduleShortName = 'Mobility Sensing'
export const cityCoordinates = '30.7046° N, 76.7179° E'
export const defaultZoomLevel = 12
export const detectorName = 'Tracko Vision'
export const detectorVersion = 'YOLOv8 edge model'
export const responseTime = '184 ms'
export const eventsProcessed = '12.4k'
export const evidenceLabel = 'Evidence frame'
export const locationLabelText = 'Location'
export const routeLabelText = 'Route'
export const busLabelText = 'Bus'
export const confidenceLabelText = 'Confidence'
export const severityLabelText = 'Severity'
export const statusLabelText = 'Status'
export const timestampLabelText = 'Detected at'
export const frameLabelText = 'Frame'
export const eventLabelText = 'Event ID'
export const sourceLabelText = 'Source'
export const noteLabelText = 'Notes'
export const mapTitle = 'AI detection map'
export const fleetTitle = 'Sensing fleet'
export const historyTitle = 'Detection history'
export const alertsTitle = 'Priority alerts'
export const analyticsTitle = 'Sensing analytics'
export const pipelineTitle = 'From dashcam to action'
export const feedTitle = 'Live bus AI feed'
export const kpiTitle = 'Network pulse'
export const demoTitle = 'Run the 20-second story'
export const detailsTitle = 'Detection details'
export const statusTitle = 'System status'
export const moduleDescription = 'Road-level intelligence, captured continuously by the fleet.'
export const calloutText = 'A pothole is detected, geotagged, prioritized, and routed to the right team before it becomes a complaint.'
export const aiPageNav = [{ name: 'Command Centre', path: '/ai-sensing', icon: 'zap' }]
export const aiPageLayout = { theme: 'dark' as const, roleId: 'traffic-centre', roleName: 'AI Mobility Sensing' }
export const demoSteps = ['5s', '10s', '15s']
export const detectionPattern = 'road-level-event'
export const routeSearchParam = 'route'
export const severitySearchParam = 'severity'
export const statusSearchParam = 'status'
export const filterSearchParam = 'query'
export const sortSearchParam = 'sort'
export const paginationSearchParam = 'page'
export const dateRangeSearchParam = 'date'
export const supportsMapMarkers = true
export const supportsVideoFeed = true
export const supportsApiPost = true
export const supportsDemoMode = true
export const supportsRealMode = true
export const supportsAnalytics = true
export const supportsFleet = true
export const supportsAlerts = true
export const supportsHistory = true
export const supportsModal = true
export const supportsResponsive = true
export const supportsOffline = true
export const supportsAccessibility = true
export const supportsKeyboard = true
export const supportsExport = true
export const supportsDarkMode = true
export const supportsLightMode = false
export const completedMilestone = 'AI Mobility Sensing module'
export const planStatus = 'approved'
export const prototypeStatus = 'demo-ready'
export const finalConstant = 'end'
