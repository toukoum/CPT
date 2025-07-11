//import ConnectButton from "@/components/chiliz/connectButton";
import CustomHead from "@/components/constantes/metadata";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ContextProvider from "@/context";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Chiliz AI Agent",
  description: "AppKit in Next.js + Wagmi",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdr = await headers();
  const cookies = hdr.get("cookie");

  return (
    <html lang="en" suppressHydrationWarning>
      <CustomHead />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <ContextProvider cookies={cookies}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {/* décalage pour le header */}
            <main className="">{children}</main>
          </ThemeProvider>
        </ContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
