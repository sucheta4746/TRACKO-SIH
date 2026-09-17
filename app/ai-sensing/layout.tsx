import { Sidebar } from '@/components/shared/Sidebar'
import { NAV_ITEMS } from '@/lib/constants'

export default function AISensingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex min-h-screen bg-[#0b1220]"><Sidebar navItems={NAV_ITEMS.trafficCentre} roleId="traffic-centre" roleName="Traffic Centre" theme="dark" /><div className="min-w-0 flex-1">{children}</div></div>
}
