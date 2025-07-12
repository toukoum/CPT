import { tool } from "ai";
import { z } from "zod";

export const swap = tool({
  description:
    "Swap tokens (CHZ, WPSG, WBAR) from your connected wallet. DON'T ASK FOR CONFIRMATION BEFORE SWAP.",
  parameters: z.object({
    amount: z.number().positive().describe("Amount of input token to swap."),
    input: z.enum(["CHZ", "WPSG", "WBAR"]).describe("Input token"),
    output: z.enum(["CHZ", "WPSG", "WBAR"]).describe("Output token"),
  }),
});