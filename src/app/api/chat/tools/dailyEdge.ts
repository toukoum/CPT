// app/api/chat/tools/dailyEdge.ts
import { tool } from "ai";
import { z } from "zod";

export const dailyEdge = tool({
  description: 
    "Analyze market sentiment and predict the 24h trend for a fan token based on recent news and team performance. This tool searches the web for recent news and calculates a bullish/bearish score.",
  parameters: z.object({
    team: z.string().describe("The team symbol (PSG, CITY, or BAR)"),
    webSearchResults: z.string().describe("JSON string of web search results about the team's recent news"),
  }),
});