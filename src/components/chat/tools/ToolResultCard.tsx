// src/components/chat/tools/ToolResultCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import {
  Check,
  ChevronDown, ChevronUp,
  CircleAlert,
  ExternalLink, ScanSearch
} from 'lucide-react';
import { useState } from 'react';
import WalletTransactionDialog from "../WalletTransactionDialog";
import GenericResultDialog from "./GenericResultDialog";
import { ToolCategory, getToolCategory } from './types';

interface ToolResultCardProps {
  toolName: string;
  result: string;
  success: boolean;
  error?: string;
  txHash?: string;
  action?: string;
}

export default function ToolResultCard({
  toolName,
  result,
  success,
  error,
  txHash,
  action
}: ToolResultCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const toolCategory = getToolCategory(toolName);

  // Attempt to parse result if it's a string
  const parsedResult = (() => {
    try {
      if (typeof result === 'string') {
        return JSON.parse(result);
      }
      return result;
    } catch (e) {
      return { message: result };
    }
  })();

  // Get transaction hash from result or props
  const transactionHash = txHash || parsedResult.txHash || parsedResult.transactionHash;

  // Explorer URL for blockchain transactions
  const explorerUrl = transactionHash && toolCategory === ToolCategory.WALLET
    ? `https://solscan.io/tx/${transactionHash}`
    : null;

  // Generate title based on tool category and success state
  const getTitle = () => {
    const actionLabel = action || toolName;

    if (success) {
      switch (toolCategory) {
        case ToolCategory.WALLET:
          return `${actionLabel} complete`;
        case ToolCategory.DATA:
          return `${toolName}`;
        case ToolCategory.SOCIAL:
          return `${toolName}`;
        default:
          return `${actionLabel} complete`;
      }
    } else {
      return `${actionLabel} failed`;
    }
  };

  // Get message based on tool category and success state
  const getMessage = () => {
    if (success) {
      switch (toolCategory) {
        case ToolCategory.WALLET:
          return `Your ${action || toolName} was processed successfully.`;
        case ToolCategory.DATA:
          return "Data processed successfully";
        case ToolCategory.SOCIAL:
          return "Social action complete";
        default:
          return "Operation completed successfully.";
      }
    } else {
      return error || "Operation failed to process";
    }
  };

  // Determine which dialog to show based on tool category
  const renderDialog = () => {
    if (toolCategory === ToolCategory.WALLET) {
      return (
        <WalletTransactionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          result={result}
        />
      );
    } else {
      return (
        <GenericResultDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          result={result}
          toolName={toolName}
        />
      );
    }
  };

  // Show summary of data if available
  const renderDataSummary = () => {
    // For data tools with data field
    if (toolCategory === ToolCategory.DATA && parsedResult.data) {
      return (
        <div className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center text-xs w-full justify-between p-2"
          >
            <span>Data Preview</span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>

          {expanded && (
            <div className="mt-2 bg-muted p-3 rounded-md text-xs overflow-x-auto max-h-40">
              <pre>{JSON.stringify(parsedResult.data, null, 2)}</pre>
            </div>
          )}
        </div>
      );
    }

    // For social tools, show compact summary
    if (toolCategory === ToolCategory.SOCIAL && !error) {
      let summaryContent = "";

      if (parsedResult.data?.name) {
        summaryContent = `Updated contact: ${parsedResult.data.name}`;
      } else if (parsedResult.data?.contactId) {
        summaryContent = `Contact ID: ${parsedResult.data.contactId}`;
      }

      if (summaryContent) {
        return (
          <div className="mt-2 text-xs text-muted-foreground">
            {summaryContent}
          </div>
        );
      }
    }

    // For utility tools, show compact summary if available
    if (toolCategory === ToolCategory.UTILITY && !error) {
      if (parsedResult.data) {
        const keys = Object.keys(parsedResult.data);
        if (keys.length > 0) {
          return (
            <div className="mt-2 text-xs text-muted-foreground">
              {keys.length} data points available
            </div>
          );
        }
      }
    }

    return null;
  };

  return (
    <Card className={cn(
      "w-full my-6 border shadow-lg",
      success
        ? "border-border"
        : "border-destructive",
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-base">{getTitle()}</p>
            {success ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <CircleAlert className="w-5 h-5" />
            )}
          </div>

          {renderDialog()}
        </div>

        <p className={cn(
          "text-sm mt-2",
          success ? "text-green-500" : "text-primary"
        )}>
          {getMessage()}
        </p>

        {/* Explorer link for blockchain transactions */}
        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-500 hover:underline mt-2"
          >
            View transaction on explorer
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {/* Render data summary based on tool category */}
        {renderDataSummary()}
      </CardContent>

      {/* Footer with appropriate actions for each tool type */}
      <CardFooter className="px-6 py-3 border-t flex justify-end gap-2">
        {/* All tool types get a details button, styled differently based on importance */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <ScanSearch className="h-4 w-4" />
          {toolCategory === ToolCategory.WALLET ? "View Details" : "View Result"}
        </Button>

        {/* Data tools get additional actions */}
        {toolCategory === ToolCategory.DATA && parsedResult.data && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(parsedResult.data));
            }}
          >
            Copy Data
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}