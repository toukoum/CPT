"use client";

import { ReactNode, useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen h-screen w-full overflow-hidden">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden w-full">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}