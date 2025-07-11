"use client";

import { ConnectButton } from "@/components/chiliz/connectButton";
import TurboTitle from "@/components/landing/turbo-title";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Header with centered navigation */}
      <section id="section0">
        <header className="py-4 px-4 sm:px-6 md:px-8 relative">
          <div className="container max-w-6xl mx-auto flex items-center justify-between relative">
            {/* Logo on left */}
            <div className="flex items-center space-x-2 z-10">
              <Image
                src="/synto/logo-white-synto.svg"
                alt="Synto"
                width={40}
                height={40}
                className="w-6 h-6"
              />
            </div>

            {/* Centered navigation */}
            <nav className="hidden md:flex items-center text-muted-foreground space-x-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link href="/agent" className="px-4 py-2 hover:bg-accent rounded-xl hover:text-primary font-medium">Chat</Link>
              <Link href="/agent" className="px-4 py-2 hover:bg-accent rounded-xl hover:text-primary font-medium">Agent</Link>
            </nav>

            {/* Connect button on right */}
            <div className="z-10">
              <ConnectButton />
            </div>
          </div>
        </header>
      </section>
      {/* Hero */}
      <main className="flex-1">
        <section className="relative py-12 md:pb-16 md:pt-10 overflow-hidden h-screen" id="section1">
          {/* Enhanced background elements with stronger colors */}
          <div className="absolute inset-0 -z-10 opacity-40">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl" />
          </div>

          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            {/* Solana Badge positioned at top with proper spacing */}
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 py-1.5 pr-4 pl-2 rounded-full border-[#9945ff75] border shadow-lg">
                <Image
                  src="/synto/solana-logo.png"
                  alt="Solana"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span className="text-xs font-medium text-white">Powered by Solana</span>
              </div>
            </div>

            {/* Headlines with adjusted spacing */}
            <div className="text-center mb-2 md:mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9945FF] to-[#14F195]">AI Agent</span> for DeFi
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Interact with crypto using simple commands, powered by AI
              </p>
            </div>

            {/* SYNTO title with adjusted spacing */}
            <div className="w-full overflow-hidden my-0 md:my-0 lg:my-0">
              <TurboTitle text="SYNTO" />
            </div>

            {/* Brief explanation with proper spacing */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <p className="text-muted-foreground">
                Your personal AI assistant for crypto operations on Solana.
                Connect your wallet, tell it what you need, and let it handle the complexity.
              </p>
            </div>

            {/* CTA buttons with improved colors */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Button asChild size="lg" className="gap-2 bg-primary border-0 hover:opacity-90 transition-opacity">
                <Link href="/agent">
                  Try Your Agent <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 border-[#9945FF]/40 hover:bg-[#9945FF]/20 transition-colors">
                <Link href="/tools">
                  Explore Tools
                </Link>
              </Button>
            </div>
            <div className="flex justify-center mt-12">
              <div className="p-2 rounded-full">
                <Button onClick={() => scrollToSection('section2')} className="bg-transparent hover:bg-accent rounded-xl hover:text-primary">
                  <ChevronDown className="animate-bounce text-white" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Agent Preview Section */}
        <section className="py-16 bg-black/20 backdrop-blur-sm" id="section2">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
              <div className="w-full lg:w-1/2">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Meet Your AI Assistant</h2>
                <p className="text-muted-foreground mb-6">
                  Your personal crypto agent comes equipped with basic capabilities like sending tokens,
                  checking balances, and performing swaps.
                </p>
                <div className="flex gap-4">
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/agent">
                      Start Chatting
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-black/40 p-1 border border-white/10 overflow-hidden">
                  <Image
                    src="/synto/agentProfileFull.png"
                    alt="AI Agent Avatar"
                    width={320}
                    height={320}
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className="absolute bottom-6 right-6 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Image
              src="/synto/logo-white-synto.svg"
              alt="Synto"
              width={24}
              height={24}
              className="w-5 h-5"
            />
            <span className="text-muted-foreground">Synto © 2025</span>
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Docs</Link>
            <Link href="#" className="hover:text-foreground">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Updated Featured Tool Card Component with avatars
const FeaturedToolCard = ({ title, description, creator, price, avatarIndex }) => {
  return (
    <div className="relative rounded-xl p-6 bg-black/40 border border-white/10 backdrop-blur-sm transition-all hover:translate-y-[-2px]">
      <div className="flex gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
          <Image
            src={`/tool-avatars/${avatarIndex}.jpeg`}
            alt={title}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-1">{title}</h3>
          <span className="text-xs text-muted-foreground">by {creator}</span>
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{price}</span>
        <Button variant="secondary" size="sm">View Details</Button>
      </div>
    </div>
  );
};