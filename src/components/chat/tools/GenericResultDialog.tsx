// src/components/chat/tools/GenericResultDialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, CheckCircle, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolCategory, getToolCategory } from './types';

interface GenericResultDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  result: string;
  toolName: string;
}

export default function GenericResultDialog({
  open,
  onOpenChange,
  result,
  toolName
}: GenericResultDialogProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const toolCategory = getToolCategory(toolName);

  // Parse the result, handling both string and object inputs
  const parsedResult = (() => {
    try {
      if (typeof result === 'string') {
        return JSON.parse(result);
      }
      return result;
    } catch (error) {
      // If parsing fails, just display the string result
      return { message: result };
    }
  })();
  
  // Handle copy functionality
  const handleCopy = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Format value for display
  const formatValue = (key: string, value: any) => {
    // For links
    if (typeof value === "string" && value.startsWith("http")) {
      return (
        <a 
          href={value} 
          className="text-blue-500 break-all hover:underline"
          target="_blank" 
          rel="noopener noreferrer"
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
      if (Array.isArray(value)) {
        return (
          <div className="pl-2 border-l-2 border-muted mt-1">
            <div className="text-xs my-1 flex justify-between">
              <span className="text-muted-foreground">Array with {value.length} items</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-2 text-xs"
                onClick={() => handleCopy(JSON.stringify(value), key)}
              >
                {copied === key ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <Copy className="h-3 w-3 mr-1" />
                )}
                Copy
              </Button>
            </div>
            <pre className="text-xs overflow-x-auto max-h-40 p-2 bg-muted/50 rounded-sm mt-1">
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        );
      }
      
      return (
        <div className="pl-2 border-l-2 border-muted mt-1">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="text-xs my-1">
              <span className="text-muted-foreground">{subKey}:</span>{" "}
              {typeof subValue === "string" || typeof subValue === "number" || typeof subValue === "boolean" 
                ? String(subValue) 
                : (
                  <pre className="text-xs overflow-x-auto max-h-20 p-1 bg-muted/50 rounded-sm mt-1 max-w-sm">
                    {JSON.stringify(subValue, null, 2)}
                  </pre>
                )
              }
            </div>
          ))}
        </div>
      );
    }
    
    // Default case: convert to string
    return String(value);
  };

  // Get appropriate dialog title based on tool category
  const getDialogTitle = () => {
    switch (toolCategory) {
      case ToolCategory.WALLET:
        return "Transaction Details";
      case ToolCategory.DATA:
        return "Data Operation Results";
      case ToolCategory.SOCIAL:
        return "Social Action Results";
      case ToolCategory.UTILITY:
        return "Tool Results";
      default:
        return `${toolName} Results`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 bg-background text-foreground">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="formatted" className="w-full">
          <div className="px-6">
            <TabsList className="grid grid-cols-2 gap-0">
              <TabsTrigger value="formatted" className="h-full">Formatted</TabsTrigger>
              <TabsTrigger value="raw" className="h-full">Raw Data</TabsTrigger>
            </TabsList>

          </div>
          
          <TabsContent value="formatted" className="p-6 pt-4">
            <div className="space-y-4 text-sm">
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
          </TabsContent>
          
          <TabsContent value="raw" className="border-t">
            <div className="p-6 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Raw JSON data</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleCopy(typeof result === 'string' ? result : JSON.stringify(parsedResult), 'raw')}
                >
                  {copied === 'raw' ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <Copy className="h-3 w-3 mr-1" />
                  )}
                  Copy JSON
                </Button>
              </div>
              <pre className="text-xs w-96 max-w-96 bg-muted p-3 rounded-md overflow-auto max-h-72">
                {JSON.stringify(parsedResult, null, 2)}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="px-6 py-3 border-t bg-muted/50 flex justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}