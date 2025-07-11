"use client";

import useChatStore from "@/app/hooks/useChatStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { generateUUID } from "@/lib/utils";
import { Message } from "ai/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface ChatTopbarProps {
  isLoading: boolean;
  chatId?: string;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  isNewChat?: boolean;
}

export default function ChatTopbar({
  isLoading,
  chatId,
  messages,
  setMessages,
  isNewChat = false,
}: ChatTopbarProps) {
  const [isLoc, setIsLoc] = React.useState(false);
  const setIsLocal = useChatStore((state) => state.setIsLocal);
  const isLocal = useChatStore((state) => state.isLocal);
  const saveMessages = useChatStore((state) => state.saveMessages);
  const setCurrentChatId = useChatStore((state) => state.setCurrentChatId);

  const handleLocalChange = (isLocal: boolean) => {
    setIsLocal(isLocal);
    setIsLoc(isLocal);
    toast(isLocal ? "Private Mode enabled" : "Private Mode disabled", {
      description: `You have switched to ${isLocal ? "private" : "public"} mode.`,
      duration: 3000,
    });
  }

  const router = useRouter();

  // Créer une nouvelle conversation
  const createNewChat = () => {
    const newChatId = generateUUID();

    // Enregistrer d'abord la conversation vide
    saveMessages(newChatId, []);

    // Définir comme conversation active
    setCurrentChatId(newChatId);

    // Naviguer vers la nouvelle conversation
    router.push(`/agent/c/${newChatId}`);
  };

  return (
    <div className="w-full flex py-3 items-center">

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-4">
          {
            !isNewChat && (
              <Button
                variant="outline"
                onClick={createNewChat}
                className="p-2"
                title="New Chat"
              >
                New Chat
                <Plus className="h-5 w-5" />
              </Button>
            )
          }
          <Switch
            id="private-mode"
            checked={isLocal}
            onCheckedChange={handleLocalChange}
          />
          <Label htmlFor="private-mode" className={isLocal ? "text-primary" : "text-muted-foreground"}>
            Private mode
          </Label>
        </div>
      </div>
    </div>
  );
}