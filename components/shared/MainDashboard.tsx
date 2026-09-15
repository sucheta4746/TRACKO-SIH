import Link from 'next/link'
import { Activity, ArrowRight, Bus, Car, Gauge, Radio, Route, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Workspace = {
  title: string
  description: string
  path: string
  action: string
  icon: typeof Activity
  accent: string
  features: string[]
  secondaryPath?: string
  secondaryAction?: string
}

const kpis = [
  { label: 'Active vehicles', value: '12,847', detail: 'Live network fleet', icon: Car, tone: 'text-blue-300' },
  { label: 'Traffic flow', value: '42%', detail: 'Current congestion', icon: Activity, tone: 'text-amber-300' },
  { label: 'Smart routes', value: '1,284', detail: 'Optimized today', icon: Route, tone: 'text-emerald-300' },
  { label: 'AI confidence', value: '98.5%', detail: 'Detection accuracy', icon: Zap, tone: 'text-cyan-300' },
]

const workspaces: Workspace[] = [
  {
    title: 'Traffic Centre',
    description: 'Monitor traffic, incidents, intersections, alerts, and city-wide response operations.',
    path: '/traffic-centre/dashboard',
    action: 'Access Dashboard',
    icon: Activity,
    accent: 'from-blue-500/20 to-cyan-400/5 text-blue-300 ring-blue-400/30',
    features: ['Live traffic', 'Incident response', 'AI sensing'],
  },
  {
    title: 'Drivers + Citizens',
    description: 'Plan journeys, navigate efficiently, and make informed travel decisions with live traffic context.',
    path: '/citizen/dashboard',
    action: 'Access Dashboard',
    secondaryPath: '/driver/dashboard',
    secondaryAction: 'Driver navigation',
    icon: Car,
    accent: 'from-emerald-500/20 to-teal-400/5 text-emerald-300 ring-emerald-400/30',
    features: ['Route planning', 'Live navigation', 'Traffic-aware ETAs'],
  },
  {
    title: 'Student + Parent',
    description: 'Track school buses, pickup progress, arrival times, and family transport updates in one place.',
    path: '/student-parent/dashboard',
    action: 'Access Dashboard',
    icon: Bus,
    accent: 'from-amber-500/20 to-orange-400/5 text-amber-200 ring-amber-400/30',
    features: ['Bus tracking', 'Pickup progress', 'Arrival alerts'],
  },
]

export function MainDashboard() {
  return (
    <main className="min-h-screen bg-[#0a1020] text-slate-100">
      <div className="relative isolate mx-auto flex min-h-screen max-w-[1440px] flex-col justify-center overflow-hidden px-5 py-12 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute -right-32 -top-40 -z-10 size-[30rem] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-40 -z-10 size-[30rem] rounded-full bg-cyan-400/5 blur-3xl" />
        <div className="pointer-events-none absolute left-[8%] top-[18%] -z-10 animate-float opacity-30">
          <Radio className="size-8 text-cyan-300" />
        </div>
        <div className="pointer-events-none absolute right-[10%] top-[28%] -z-10 animate-float animation-delay-300 opacity-25">
          <Route className="size-10 text-blue-300" />
        </div>
        <div className="pointer-events-none absolute bottom-[14%] right-[18%] -z-10 animate-float animation-delay-500 opacity-25">
          <Zap className="size-7 text-amber-300" />
        </div>

        <header className="mx-auto mb-12 w-full max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-4 text-xl font-bold uppercase tracking-[.28em] text-blue-200">
            <span className="flex size-14 items-center justify-center rounded-2xl border border-blue-300/30 bg-blue-500/15 text-blue-200 shadow-[0_0_34px_rgba(59,130,246,.28)]">
              <Gauge className="size-7" />
            </span>
            TRACKO
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            AI-URBAN INTELLIGENCE PLATFORM
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Smart traffic optimization for city operations, everyday travel, and safer school journeys.
          </p>
        </header>

        <section className="mx-auto mb-10 grid w-full max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Platform KPIs">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.label} className={`kpi-card border-slate-700/70 bg-slate-900/70 text-slate-100 shadow-[0_14px_36px_rgba(2,6,23,.24)] animation-delay-${(index + 1) * 100}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">{kpi.label}</span>
                    <Icon className={`size-4 ${kpi.tone}`} />
                  </div>
                  <p className="kpi-value mt-3 text-2xl font-bold text-white">{kpi.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{kpi.detail}</p>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <section className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-3" aria-label="Stakeholder workspaces">
          {workspaces.map((workspace) => {
            const Icon = workspace.icon
            return (
              <Card key={workspace.title} className="group overflow-hidden border-slate-700/70 bg-slate-900/80 py-0 text-slate-100 shadow-[0_18px_50px_rgba(2,6,23,.28)] backdrop-blur-sm">
                <CardContent className="flex h-full flex-col p-6 sm:p-7">
                  <div className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(59,130,246,.18)] ${workspace.accent}`}>
                    <Icon className="size-7" />
                  </div>
                  <h2 className="mt-7 text-2xl font-bold text-white">{workspace.title}</h2>
                  <p className="mt-3 min-h-20 text-sm leading-6 text-slate-300">{workspace.description}</p>
                  <div className="mt-5 flex min-h-14 flex-wrap content-start gap-2">
                    {workspace.features.map((feature) => (
                      <span key={feature} className="rounded-full border border-slate-600/80 bg-slate-800/75 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors group-hover:border-slate-500 group-hover:text-white">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="mt-7 space-y-2">
                    <Link href={workspace.path} className="block">
                      <Button className="w-full justify-between bg-blue-600 text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500">
                        {workspace.action}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    {workspace.secondaryPath && workspace.secondaryAction && (
                      <Link href={workspace.secondaryPath} className="block">
                        <Button variant="outline" className="w-full border-slate-600 bg-slate-900/70 text-slate-200 hover:border-slate-400 hover:bg-slate-800 hover:text-white">
                          {workspace.secondaryAction}
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>
      </div>
    </main>
  )
}
