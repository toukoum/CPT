/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import useChatStore from '@/app/hooks/useChatStore';
import AgentProfile from '@/components/agent/agent-profile';
import AgentTools from '@/components/agent/agent-tools';
import { ConnectButton } from '@/components/chiliz/connectButton'; // Reown AppKit button
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateUUID } from '@/lib/utils';
import { useAppKitAccount } from '@reown/appkit/react'; // ✅ nouveau hook
import { MessageSquare, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function AgentPage() {
  const [activeTab, setActiveTab] = useState<'tools' | 'chat'>('tools');

  // ──────────────────────────────────────────────────────────────
  // 1. Récupère l’adresse du wallet et l’état de connexion
  // ──────────────────────────────────────────────────────────────
  const { address, isConnected } = useAppKitAccount();                   // ✅

  const router = useRouter();

  // ──────────────────────────────────────────────────────────────
  // 2. Zustand : chats et helpers
  // ──────────────────────────────────────────────────────────────
  const chats            = useChatStore((s) => s.chats);
  const saveMessages     = useChatStore((s) => s.saveMessages);
  const setCurrentChatId = useChatStore((s) => s.setCurrentChatId);
  const newChatId        = useMemo(() => generateUUID(), []);

  // ──────────────────────────────────────────────────────────────
  // 3. Quand l’onglet “Chat” est actif et qu’un wallet est connecté,
  //    ouvre la dernière conversation ou crée-en une nouvelle.
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === 'chat' && isConnected && address) {
      const entries = Object.entries(chats);
      if (entries.length) {
        const [latestId] = entries
          .sort(([, a], [, b]) =>
            new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
          )[0];
        setCurrentChatId(latestId);
        router.push(`/agent/c/${latestId}`);
      } else {
        saveMessages(newChatId, []);
        setCurrentChatId(newChatId);
        router.push(`/agent/c/${newChatId}`);
      }
    }
  }, [activeTab, isConnected, address, chats, newChatId, router, saveMessages, setCurrentChatId]);

  // ──────────────────────────────────────────────────────────────
  // 4. Pas de wallet → invite l’utilisateur à se connecter
  // ──────────────────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className="w-full py-6 px-10">
        <h1 className="text-3xl font-bold mb-2">My Agent</h1>
        <p className="text-muted-foreground mb-6">
          Please connect your wallet to access your agent.
        </p>
        <ConnectButton className="fixed top-4 right-4" />
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 5. Wallet connecté : affiche l’interface complète
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex flex-col">
      <header className="w-full border-b flex justify-between items-center px-4 py-2 sticky top-0 z-10 bg-background">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-md h-full"
        >
          <TabsList className="grid grid-cols-2 w-72 h-full">
            <TabsTrigger value="tools" className="flex items-center gap-2 h-full">
              <Sparkles className="h-4 w-4" /> Agent
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2 h-full">
              <MessageSquare className="h-4 w-4" /> Chat
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="hidden md:block">
          <ConnectButton />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 h-full overflow-y-auto">
          <AgentProfile walletAddress={address} />
          <AgentTools   walletAddress={address} />
        </div>
      </main>
    </div>
  );
}
