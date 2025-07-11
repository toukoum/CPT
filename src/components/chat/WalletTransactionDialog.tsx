import { useState, useMemo } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Copy, CheckCircle } from "lucide-react";

function WalletTransactionDialog({
  open,
  onOpenChange,
  result,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  result: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  // Parse the result, handling both string and object inputs
  const parsedResult = useMemo(() => {
    try {
      if (typeof result === 'string') {
        return JSON.parse(result);
      }
      return result;
    } catch (error) {
      // If parsing fails, just display the string result
      return { message: result };
    }
  }, [result]);
  
  // Extract transaction hash if available
  const txHash = parsedResult.txHash || parsedResult.transactionHash || '';
  const explorerUrl = txHash ? `https://solscan.io/tx/${txHash}?cluster=devnet` : null;
  
  // Handle copy functionality
  const handleCopy = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Format value for display
  const formatValue = (key: string, value: any) => {
    // Handle transaction hash specially
    if ((key === 'txHash' || key === 'transactionHash') && typeof value === 'string') {
      return (
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs break-all">
            {value.substring(0, 10)}...{value.substring(value.length - 8)}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(value, key);
            }}
          >
            {copied === key ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          {explorerUrl && (
            <a 
              href={explorerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      );
    }
    
    // For links
    if (typeof value === "string" && value.startsWith("http")) {
      return (
        <a 
          href={value} 
          className="text-blue-500 break-all hover:underline"
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {value} <ExternalLink className="inline h-3 w-3" />
        </a>
      );
    }
    
    // For boolean values, show as Yes/No
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    
    // For objects (nested properties)
    if (typeof value === "object" && value !== null) {
      return (
        <div className="pl-2 border-l-2 border-muted mt-1">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="text-xs my-1">
              <span className="text-muted-foreground">{subKey}:</span>{" "}
              {typeof subValue === "string" ? subValue : JSON.stringify(subValue)}
            </div>
          ))}
        </div>
      );
    }
    
    // Default case: convert to string
    return String(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>Details of your completed transaction</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4 text-sm">
          {Object.entries(parsedResult).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="text-muted-foreground uppercase text-xs">
                {key.replace(/_/g, ' ')}
              </span>
              <div className="font-medium break-all mt-1">
                {formatValue(key, value)}
              </div>
              <Separator className="mt-2" />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WalletTransactionDialog;