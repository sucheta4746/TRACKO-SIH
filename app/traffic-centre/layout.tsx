"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { NAV_ITEMS } from "@/lib/constants";

export default function TrafficCentreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Apply dark theme for Traffic Centre
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0a0f1a]">
      <Sidebar
        navItems={NAV_ITEMS.trafficCentre}
        roleId="traffic-centre"
        roleName="Traffic Centre"
        theme="dark"
      />
      <main className="flex-1 lg:pl-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
