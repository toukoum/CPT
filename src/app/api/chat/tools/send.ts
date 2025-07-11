import { tool } from "ai";
import { z } from "zod";

export const send = tool({
	description: "send Solana from your connected wallet to another address on the Solana Devnet. DON'T ASK FOR CONFIRMATION.",
	parameters: z.object({
		to: z.string().min(32).max(44).describe("Recipient SOL address."),
		amount: z.number().positive().describe("Amount of SOL to send."),
	}),
});