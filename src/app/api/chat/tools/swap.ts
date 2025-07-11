import { tool } from "ai";
import { z } from "zod";

export const swap = tool({
  description:
    "Swap SOL (input) to output from your connected wallet. DON'T ASK FOR CONFIRMATION BEFORE SWAP.",
  parameters: z.object({
    amount: z.number().positive().describe("Amount of SOL to swap."),
    input: z.enum(["SOL", "BTC", "USDC", "ETH", "META"]).describe("Input token address"),
    output: z
      .enum(["SOL", "BTC", "USDC", "ETH", "META"])
      .describe("Output token address"),
  }),
});
