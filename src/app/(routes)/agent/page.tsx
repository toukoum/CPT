// app/agent/page.tsx
'use client';

import { ConnectButton } from '@/components/chiliz/connectButton';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateUUID } from '@/lib/utils';
import { useAppKitAccount } from '@reown/appkit/react';
import { MessageSquare, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ToolCard } from '@/components/agent/tool-card-static';
import { AGENT_TOOLS } from '@/utils/tool-list';


// Configuration des équipes
const TEAMS = [
  { id: 'PSG', name: 'Paris Saint-Germain', logo: '/chiliz/psg.png' },
  { id: 'BAR', name: 'FC Barcelona', logo: '/chiliz/bar.png' },
  { id: 'CITY', name: 'Manchester City', logo: '/chiliz/city.png' },
  { id: 'JUV', name: 'Juventus', logo: '/chiliz/juv.png' },
  { id: 'ATM', name: 'Atlético Madrid', logo: '/chiliz/atm.png' },
];

// Tools hardcodés


export default function AgentPage() {
  const [activeTab, setActiveTab] = useState<'tools' | 'chat'>('tools');
  const [selectedTeam, setSelectedTeam] = useState<string>('PSG');
  const [toolStates, setToolStates] = useState<Record<string, boolean>>({});
  
  const { address, isConnected } = useAppKitAccount();
  const router = useRouter();
  const newChatId = useMemo(() => generateUUID(), []);

  // Charger l'équipe préférée depuis localStorage
  useEffect(() => {
    const savedTeam = localStorage.getItem('preferredTeam');
    if (savedTeam && TEAMS.find(t => t.id === savedTeam)) {
      setSelectedTeam(savedTeam);
    }
  }, []);

  // Sauvegarder l'équipe préférée
  const handleTeamChange = (teamId: string) => {
    setSelectedTeam(teamId);
    localStorage.setItem('preferredTeam', teamId);
  };

  // Gérer les états des tools
  const handleToolToggle = (toolId: string, enabled: boolean) => {
    setToolStates(prev => ({ ...prev, [toolId]: enabled }));
  };

  // Redirection vers le chat
  useEffect(() => {
    if (activeTab === 'chat' && isConnected) {
      router.push(`/agent/c/${newChatId}`);
    }
  }, [activeTab, isConnected, newChatId, router]);

  if (!isConnected) {
    return (
      <div className="w-full py-6 px-10">
        <h1 className="text-3xl font-bold mb-2">My Agent</h1>
        <p className="text-muted-foreground mb-6">
          Please connect your wallet to access your agent.
        </p>
        <ConnectButton />
      </div>
    );
  }

  const currentTeam = TEAMS.find(t => t.id === selectedTeam) || TEAMS[0];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 h-full overflow-y-auto max-w-7xl mx-auto">
          {/* Agent Profile Section */}
          <Card className="mb-8 overflow-hidden bg-black/20 border border-[#FF004A]/20">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                {/* Avatar avec couleurs de l'équipe */}
                <div className="relative flex-shrink-0">
                  <div className="rounded-full overflow-hidden w-32 h-32 flex items-center justify-center bg-gradient-to-br from-[#FF004A] to-[#FF004A]/50 p-1">
                    <Image
                      src={currentTeam.logo}
                      alt={currentTeam.name}
                      width={120}
                      height={120}
                      className="object-contain rounded-full bg-background "
                    />
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex flex-col text-center md:text-left flex-1">
                  <h1 className="text-2xl font-bold mb-1">Kylian Mbappé</h1>
                  <p className="font-mono text-xs text-muted-foreground mb-4">
                    {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ''}
                  </p>

                  <div className="text-muted-foreground mb-4">
                    Your personal AI assistant for Chiliz ecosystem. Manage your fan tokens, 
                    get market insights, and engage with your favorite teams.
                  </div>

                  {/* Team Selector */}
                  <div className="flex items-center gap-4">
                    <Label>Preferred Team:</Label>
                    <Select value={selectedTeam} onValueChange={handleTeamChange}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TEAMS.map(team => (
                          <SelectItem key={team.id} value={team.id}>
                            <div className="flex items-center gap-2">
                              <Image
                                src={team.logo}
                                alt={team.name}
                                width={20}
                                height={20}
                                className="object-contain"
                              />
                              {team.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tools Section */}
          <div>
            <h2 className="text-xl font-semibold mb-6">
              Agent Capabilities ({AGENT_TOOLS.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AGENT_TOOLS.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isEnabled={toolStates[tool.id] ?? tool.enabled}
                  onToggle={(enabled) => handleToolToggle(tool.id, enabled)}
                  newChatId={newChatId}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}