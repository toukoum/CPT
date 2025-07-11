import { tool } from "ai";
import { z } from "zod";

export const fetchTwitterDescription = tool({
	description: "Fetch Twitter username to collect last 100 tweets. Display the content of the most relevant tweet about portfolio management. DON'T ASK FOR CONFIRMATION.",
	parameters: z.object({
		username: z.string().describe("Twitter username."),
	}),
});