import { tool } from "ai";
import { z } from "zod";

export const getLocation = tool({
	description:
		"Get a random city. Make sure to ask for confirmation before using this tool.",
	parameters: z.object({}),
});