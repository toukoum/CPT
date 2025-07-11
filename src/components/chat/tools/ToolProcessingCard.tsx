// src/components/chat/tools/ToolProcessingCard.tsx
import { useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Player } from '@lordicon/react';
import { LoaderCircle } from 'lucide-react';
import { TransactionState, ToolCategory, getToolCategory } from './types';
import ICON from '@/components/icons/rook.json';

interface ToolProcessingCardProps {
  toolName: string;
  state: TransactionState;
  isWallet?: boolean;
}

export default function ToolProcessingCard({ 
  toolName, 
  state, 
  isWallet = false 
}: ToolProcessingCardProps) {
  const playerRef = useRef<Player>(null);
  const toolCategory = getToolCategory(toolName);

  useEffect(() => {
    // Play animation when component mounts
    playerRef.current?.playFromBeginning();
  }, []);

  // Different messages based on tool category and state
  const getStateMessage = () => {
    switch (state) {
      case TransactionState.WAITING_CONFIRMATION:
        return "Please confirm this transaction in your wallet";
      case TransactionState.PENDING:
        switch (toolCategory) {
          case ToolCategory.WALLET:
            return "Transaction submitted, waiting for confirmation";
          case ToolCategory.DATA:
            return "Processing your data, please wait";
          case ToolCategory.SOCIAL:
            return "Updating your social information";
          default:
            return "Processing your request";
        }
      case TransactionState.SUCCESS:
        return "Completed successfully!";
      case TransactionState.FAILED:
        return "Failed to complete";
      default:
        return "Processing...";
    }
  };

  return (
    <Card className="w-full my-6 border border-border">
      <CardContent className="p-6 flex flex-col space-y-2">
        <div className="flex items-center gap-3">
          {/* Animation/Icon */}
          {state === TransactionState.PENDING ? (
            <Player
              icon={ICON}
              ref={playerRef}
              size={24}
              onComplete={() => {
                // Replay animation on completion after a short delay
                setTimeout(() => {
                  playerRef.current?.playFromBeginning();
                }, 800);
              }}
            />
          ) : (
            <LoaderCircle className="h-6 w-6 animate-spin" />
          )}
          
          {/* Title */}
          <div className="flex flex-col">
            <p className="font-semibold text-base">
              {toolName}
              {state === TransactionState.WAITING_CONFIRMATION 
                ? " requires confirmation" 
                : " is processing"}
            </p>
            <p className="text-xs text-muted-foreground">
              {getStateMessage()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}