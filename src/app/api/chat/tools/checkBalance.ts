import { tool } from "ai";
import { z } from "zod";

export const checkBalance = tool({
  description:
    "Query the balance of a token of your connected wallet. Don't ask for confirmation before checking.",
  parameters: z.object({
    address: z
      .enum(["SOL", "BTC", "USDC", "ETH", "META"])
      .describe("Input token address"),
  }),
});
