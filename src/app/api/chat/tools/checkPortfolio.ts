import { tool } from "ai";
import { z } from "zod";

export const checkPortfolio = tool({
  description:
    "Check the user's portfolio on Chiliz chain (CHZ and fan tokens). Don't ask for confirmation before checking.",
  parameters: z.object({}),
});
