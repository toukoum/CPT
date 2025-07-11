// src/components/chat/tools/WalletConfirmation.tsx
import {
  BTC,
  META,
  SOL,
  USDC,
  wETH,
} from "@/components/constantes/tokenAddresses";
import ICON from "@/components/icons/rook.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BuildSwapInstruction, QueryMintDecimals } from "@/utils/crypto";
import { Player } from "@lordicon/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { Shield } from "lucide-react";
import { useState } from "react";
import ToolProcessingCard from "./ToolProcessingCard";
import ToolResultCard from "./ToolResultCard";
import { TransactionState } from "./types";

interface WalletConfirmationProps {
  toolCallId: string;
  toolName: string;
  args: any;
  addToolResult?: (args: { toolCallId: string; result: string }) => void;
}

export default function WalletConfirmation({
  toolCallId,
  toolName,
  args,
  addToolResult,
}: WalletConfirmationProps) {
  const [txState, setTxState] = useState<TransactionState>(
    TransactionState.WAITING_CONFIRMATION
  );
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // Send transaction based on tool type
  const handleConfirm = async () => {
    if (!publicKey) return;

    setTxState(TransactionState.PENDING);

    try {
      let signature: string;

      switch (toolName.toLowerCase()) {
        case "send":
          // Handle send transaction
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: new PublicKey(args.to),
              lamports: args.amount * 1e9, // Convert SOL to lamports
            })
          );

          signature = await sendTransaction(transaction, connection);
          break;

        case "swap":
          // This would be implemented for swap functionality
          const { input, output, amount } = args;
          let inputAddress: string;
          let outputAddress: string;
          switch (input) {
            case "SOL":
              inputAddress = SOL;
              break;
            case "BTC":
              inputAddress = BTC;
              break;
            case "USDC":
              inputAddress = USDC;
              break;
            case "ETH":
              inputAddress = wETH;
              break;
            case "META":
              inputAddress = META;
              break;
            default:
              throw new Error("Invalid input token");
          }

          switch (output) {
            case "SOL":
              outputAddress = SOL;
              break;
            case "BTC":
              outputAddress = BTC;
              break;
            case "USDC":
              outputAddress = USDC;
              break;
            case "ETH":
              outputAddress = wETH;
              break;
            case "META":
              outputAddress = META;
              break;
            default:
              throw new Error("Invalid output token");
          }

          const decimals = await QueryMintDecimals(connection, inputAddress);

          const instruction = await BuildSwapInstruction(
            inputAddress,
            outputAddress,
            amount * 10 ** decimals,
            publicKey.toString()
          );

          console.log("Swap instruction:", instruction);
          const versInstruction = VersionedTransaction.deserialize(
            Buffer.from(instruction, "base64")
          );

          signature = await sendTransaction(versInstruction, connection);
          break;

        default:
          // Generic wallet transaction handler
          signature = "sim_" + Date.now().toString(16);
      }

      // Set transaction hash and update state
      setTxHash(signature);
      setTxState(TransactionState.SUCCESS);

      // Return the result to the AI
      if (addToolResult) {
        const result = JSON.stringify({
          success: true,
          txHash: signature,
          ...args,
        });
        addToolResult({ toolCallId, result });
      }
    } catch (err: any) {
      console.error("Transaction error:", err);
      setTxState(TransactionState.FAILED);
      setError(err.message || "Transaction failed");

      // Return the error to the AI
      if (addToolResult) {
        const result = JSON.stringify({
          success: false,
          error: err.message || "Transaction failed",
        });
        addToolResult({ toolCallId, result });
      }
    }
  };

  // User rejected the transaction
  const handleReject = () => {
    setTxState(TransactionState.FAILED);
    setError("Transaction rejected by user");

    // Return the rejection to the AI
    if (addToolResult) {
      const result = JSON.stringify({
        success: false,
        error: "Transaction rejected by user",
      });
      addToolResult({ toolCallId, result });
    }
  };

  // Show appropriate card based on transaction state
  if (txState === TransactionState.SUCCESS) {
    return (
      <ToolResultCard
        toolName={toolName}
        result={JSON.stringify({ ...args, txHash })}
        success={true}
        txHash={txHash || undefined}
        action={toolName}
      />
    );
  }

  if (txState === TransactionState.FAILED) {
    return (
      <ToolResultCard
        toolName={toolName}
        result={JSON.stringify({ error })}
        success={false}
        error={error || "Transaction failed"}
        action={toolName}
      />
    );
  }

  if (txState === TransactionState.PENDING) {
    return (
      <ToolProcessingCard toolName={toolName} state={txState} isWallet={true} />
    );
  }

  // Confirmation UI (WAITING_CONFIRMATION state)
  return (
    <Card className="w-full my-6 border border-border">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">{toolName}</h3>
        </div>

        <div className="bg-muted p-4 rounded-md mb-4">
          {Object.entries(args).map(([key, value]) => (
            <div key={key} className="flex flex-col mb-2">
              <span className="text-xs text-muted-foreground">{key}</span>
              <span className="text-sm font-medium">{String(value)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Player icon={ICON} size={16} />
          <p>Please confirm this transaction in your wallet</p>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-3 border-t bg-muted/50 flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={handleReject}>
          Reject
        </Button>
        <Button variant="default" size="sm" onClick={handleConfirm}>
          Confirm
        </Button>
      </CardFooter>
    </Card>
  );
}
