import { tool } from "ai";
import { z } from "zod";

/**
 * Envoie des CHZ natifs (CAP-20) vers une adresse EVM sur Chiliz Chain.
 * AUCUNE confirmation supplémentaire : l’UI WalletConfirmation s’en charge.
 */
export const send = tool({
  description:
    "send native CHZ from the connected Chiliz wallet to another address on Chiliz Chain. DON'T ASK FOR CONFIRMATION.",
  parameters: z.object({
    to: z
      .string()
      .length(42)
      .startsWith("0x")
      .describe("Recipient EVM address on Chiliz Chain."),
    amount: z
      .number()
      .positive()
      .describe("Amount of CHZ to send (decimals: 18)."),
  }),
});
