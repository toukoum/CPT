"use client";

import { ConnectButton } from "@/components/chiliz/connectButton"; // ✅ Reown button
import { AppLayout } from "@/components/layouts/app-layout";
import { Toaster } from "@/components/ui/sonner";
import { useAppKitAccount } from "@reown/appkit/react"; // ✅ Reown
import { ReactNode } from "react";

export default function AppRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isConnected } = useAppKitAccount();                     // ✅ état connexion

  return (
    <AppLayout>
      {isConnected ? null : <ConnectButton className="fixed top-4 right-4" />}
      {children}
      <Toaster />
    </AppLayout>
  );
}
