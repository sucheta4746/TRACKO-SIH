import { Sidebar } from '@/components/shared/Sidebar'
import { NAV_ITEMS } from '@/lib/constants'

export default function AISensingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex min-h-screen bg-[#0b1220]"><Sidebar navItems={[...NAV_ITEMS.trafficCentre.filter((item) => item.path.includes('dashboard')), { name: 'AI Mobility Sensing', path: '/ai-sensing', icon: 'zap' }]} roleId="ai-sensing" roleName="AI Mobility Sensing" theme="dark" /><div className="min-w-0 flex-1">{children}</div></div>
}
