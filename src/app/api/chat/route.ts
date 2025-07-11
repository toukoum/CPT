import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { send } from "./tools/send";
import { convert } from "./tools/convert";
import { swap } from "./tools/swap";
import { getLocation } from "./tools/getLocation";
import { getWeather } from "./tools/getWeather";
import { SYSTEM_PROMPT } from "./prompt";

import { addContact, getContact } from "./tools/contact";
import { fetchTwitterDescription } from "./tools/fetchTwitterDescription";
import { checkPortfolio } from "./tools/checkPortfolio";
import { checkBalance } from "./tools/checkBalance";
import { displayresults } from "./tools/displayResult";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, isLocal } = await req.json();
    console.log("[CHAT-API] Incoming messages:", messages);
    console.log("isLocal:", isLocal);

    messages.unshift(SYSTEM_PROMPT);

    const staticTools = {
      //convert,
      //send,
      //swap,
      //checkBalance,
      //fetchTwitterDescription,
      //getLocation,
      checkPortfolio,
      getWeather,
      //addContact,
      //getContact,
      //displayresults,
    };

    // Merge static and dynamic tools
    const tools = {
      ...staticTools,
    };

    // Log available tools for debugging
    console.log("Available tools:", Object.keys(tools));

    let result;

		if (!isLocal) {
			result = streamText({
				model: openai("gpt-4o"),
				messages,
				tools,
				maxSteps: 20,
			});
		} else {
			result = streamText({
				model: openai("gpt-4o"),
				messages,
				tools,
				maxSteps: 20,
			});
		}

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error(
          "ERREUR AVEC LE STREAMING DE LA RESPONSE API CALL:",
          error
        );
        return "An error occurred during the API call.";
      },
    });
  } catch (err) {
    console.error("ERREUR PLUS GLOBALE", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
