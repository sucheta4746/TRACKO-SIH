"use client";

import { Sidebar } from "@/components/shared/Sidebar";
import { NAV_ITEMS } from "@/lib/constants";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#080f20] text-slate-100">
      <Sidebar navItems={NAV_ITEMS.citizen} roleId="citizen" roleName="Citizen services" theme="dark" />
      <main className="min-h-screen flex-1">
        {children}
      </main>
    </div>
  );
}
