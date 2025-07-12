// components/chat/tools-drawer.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { ChevronUp, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

// Import de la liste des tools hardcodés
import { AGENT_TOOLS } from "@/app/agent/agent-tools-config";

interface Tool {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  enabled?: boolean;
  isDefault?: boolean;
  parameters: {
    params: {
      name: string;
      type: string;
      required: boolean;
      description?: string;
    }[];
  };
  createdAt: string;
}

export function ToolsDrawer() {
  const [tools, setTools] = useState<Tool[]>(AGENT_TOOLS);
  const [open, setOpen] = useState(false);
  const [enabledToolsCount, setEnabledToolsCount] = useState(0);

  // Calculer le nombre d'outils activés
  useEffect(() => {
    const count = tools.filter(tool => tool.enabled).length;
    setEnabledToolsCount(count);
  }, [tools]);

  // Gérer le toggle des tools (état local seulement)
  const handleToggle = (id: string, checked: boolean) => {
    setTools(prevTools => 
      prevTools.map(tool =>
        tool.id === id ? { ...tool, enabled: checked } : tool
      )
    );
  };

  const totalToolsCount = tools.length;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/30 backdrop-blur-md border border-[#FF004A]/40 text-white/90 rounded-full text-xs font-medium select-none transition-all shadow-sm hover:border-[#FF004A]/60">
          <ChevronUp className="h-4 w-4 text-[#FF004A]" />
          <span>
            <span className="flex items-center gap-1 font-semibold">
              Tools: <span className="text-[#FF004A]">{enabledToolsCount}</span>
            </span>
          </span>
        </div>
      </DrawerTrigger>

      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/40 z-40" />
        <DrawerContent className="bg-background flex flex-col rounded-t-[10px] h-[80%] fixed bottom-0 left-0 right-0 z-50 outline-none">

          {/* Header section */}
          <div className="px-4 py-4 w-full max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Agent Tools</h2>
              <Badge variant="outline" className="border-[#FF004A]/20 text-[#FF004A]">
                {enabledToolsCount}/{totalToolsCount} Enabled
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Manage which tools your agent can use in this conversation
            </p>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <div className="w-full max-w-3xl mx-auto p-4">
              <div className="space-y-3">
                {tools.map(tool => (
                  <ToolItem
                    key={tool.id}
                    tool={tool}
                    onToggle={(checked) => handleToggle(tool.id, checked)}
                  />
                ))}
              </div>
            </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}

function ToolItem({ tool, onToggle }: { tool: Tool; onToggle: (checked: boolean) => void }) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={`border rounded-md p-3 transition-all ${
      tool.enabled 
        ? 'bg-card border-border' 
        : 'bg-muted/30 border-muted text-muted-foreground'
    }`}>
      <div className="flex items-center gap-3">
        <Avatar className={`h-10 w-10 ${!tool.enabled ? 'opacity-60' : ''}`}>
          <AvatarImage 
            src={tool.image || "/chiliz/cover-tool.png"} 
            alt={tool.name} 
          />
          <AvatarFallback className="bg-[#FF004A]/10 text-[#FF004A]">
            {getInitials(tool.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-medium ${!tool.enabled ? 'text-muted-foreground' : ''}`}>
              {tool.name}
            </h3>
            {tool.isDefault && (
              <Badge 
                variant="outline" 
                className="bg-[#FF004A]/10 border-[#FF004A]/20 text-[#FF004A] text-xs font-normal"
              >
                <Sparkles className="h-2.5 w-2.5 mr-1" />
                Default
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="text-xs font-normal"
            >
              {tool.category}
            </Badge>
          </div>
          <p className={`text-xs mt-1 line-clamp-2 ${
            !tool.enabled ? 'text-muted-foreground/70' : 'text-muted-foreground'
          }`}>
            {tool.description}
          </p>
        </div>

        <Switch
          checked={tool.enabled ?? true}
          onCheckedChange={onToggle}
          aria-label={`Enable ${tool.name}`}
          className="data-[state=checked]:bg-[#FF004A]"
        />
      </div>

      {tool.parameters.params.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1 pl-[52px]">
          {tool.parameters.params.slice(0, 3).map((param, idx) => (
            <Badge 
              key={`param-${tool.id}-${idx}`} 
              variant="outline" 
              className="text-[10px] px-1.5 py-0 border-muted-foreground/20"
            >
              {param.name}
            </Badge>
          ))}
          {tool.parameters.params.length > 3 && (
            <Badge 
              variant="outline" 
              className="text-[10px] px-1.5 py-0 border-muted-foreground/20"
            >
              +{tool.parameters.params.length - 3} more
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}