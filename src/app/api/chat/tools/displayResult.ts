import { tool } from "ai";
import { z } from "zod";

export const displayresults = tool({
  description:
    `WHEN USING THIS TOOL MAKE SURE THE CURRENCIES ARE DOLLARS (MAKE CONVERSION OTHERWISE)Display a pie chart visualization of portfolio allocation or asset distribution. 
     The data should represent asset categories and their values/percentages.
     
Example:
\`\`\`
[
  { x: "Stocks", y: 45 },
  { x: "Bonds", y: 25 },
  { x: "Cash", y: 15 },
  { x: "Crypto", y: 10 },
  { x: "Real Estate", y: 5 },
]
\`\`\`
`,
  parameters: z.object({
    chartData: z.array(z.object({ 
      x: z.string().describe("Asset name or category"), 
      y: z.number().describe("Percentage or value of the asset in portfolio")
    })),
    title: z.string().describe("Title of the portfolio chart.").default("Portfolio Allocation"),
    description: z.string().describe("Description of the portfolio chart.").default("Current asset distribution"),
  }),
  execute: async ({ chartData, title, description }) => {
    // Return formatted data for chart rendering
    return { data: chartData, title, description };
  },
});