import { tool } from "ai";
import { z } from "zod";

export const addContact = tool({
  description: "Add a contact with a name and wallet address to the user's contact list for easy sending of SOL in the future.",
  parameters: z.object({
    name: z.string().min(3).describe("Name of the contact (minimum 3 characters)"),
    address: z.string().min(32).max(44).describe("Solana wallet address of the contact"),
  }),
});


export const getContact = tool({
  description: "Find a contact's wallet address by their name from the user's contact list. Use this before sending SOL to a contact by name.",
  parameters: z.object({
    name: z.string().min(3).describe("Name of the contact to find"),
  }),
});