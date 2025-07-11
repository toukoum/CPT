"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Copy, CreditCard, Database, DollarSign, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

function copyToClipboard(text: string) {
  if (!text) return;
  toast("Suggestion copied to clipboard", {
    description: "Paste it in the input field or click to start",
  });
  navigator.clipboard.writeText(text);
}

// Structure des suggestions avec icônes et catégories
interface SuggestionItem {
  text: string;
  icon: React.ReactNode;
  category: "transaction" | "query" | "swap" | "information";
  description: string;
}
//BipPiy6YiJF3cFqKVRXuZvVsMeJsoWYrGYJxYxKc3GEU
export default function CardList() {
  const suggestionItems: SuggestionItem[] = [
    {
      text: "Send 0.002 SOL to Louis",
      icon: <CreditCard className="h-5 w-5" />,
      category: "transaction",
      description: "Send tokens to another wallet"
    },
    {
      text: "How much SOL do I have remaining?",
      icon: <Database className="h-5 w-5" />,
      category: "query",
      description: "Check your wallet balance"
    },
    {
      text: "Swap 0.001 SOL for USDC",
      icon: <RefreshCw className="h-5 w-5" />,
      category: "swap",
      description: "Exchange tokens on Solana"
    },
    {
      text: "What is the value of 0.01 SOL in USDC?",
      icon: <DollarSign className="h-5 w-5" />,
      category: "information",
      description: "Get token price information"
    },
  ];

  // Couleurs des cartes par catégorie
  const categoryColors = {
    transaction: "from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/30",
    query: "from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/30",
    swap: "from-amber-500/10 to-amber-600/5 border-amber-500/20 hover:border-amber-500/30",
    information: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/30"
  };

  return (
    <div className="w-full max-w-4xl md:px-4 mt-3">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestionItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
              "rounded-xl border cursor-pointer p-4",
              "bg-gradient-to-br shadow-sm hover:shadow-md transition-all duration-200",
              categoryColors[item.category]
            )}
            onClick={() => copyToClipboard(item.text)}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg bg-background/80 border",
                item.category === "transaction" && "text-blue-500",
                item.category === "query" && "text-purple-500",
                item.category === "swap" && "text-amber-500",
                item.category === "information" && "text-emerald-500",
              )}>
                {item.icon}
              </div>

              <div className="flex-1">
                <h4 className="font-medium mb-1 text-sm">
                  {item.text}
                </h4>

                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(item.text);
                }}
                className="shrink-0 h-8 w-8 rounded-full p-0"
                variant="ghost"
                size="sm"
              >
                <Copy className="h-3.5 w-3.5" />
                <span className="sr-only">Copy to clipboard</span>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}