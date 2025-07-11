import { addressesToken } from "@/components/constantes/tokenAddresses";
import { FetchBalances } from "@/utils/crypto";
import { PublicKey } from "@solana/web3.js";
import { createPublicClient, formatUnits, http, parseAbi } from 'viem';
import { chiliz } from 'viem/chains';
import { isWalletTool } from "./types";
// List of wallet tools that should be handled by UI

/**
 * Execute a tool call from the AI
 * @param tool The tool call from the AI
 * @param userWalletAddress The user's wallet address
 * @returns The result of the tool execution as a string, or null if it should be handled by the UI
 */
export const executeToolCall = async (
  tool: any,
  userWalletAddress?: string
): Promise<string | null> => {
  const toolName = tool.toolCall.toolName;
  const args = tool.toolCall.args;
  console.log("Tool call:", toolName, args);

  // Return null for wallet tools to be handled by UI
  if (isWalletTool(toolName)) {
    console.log(
      `Tool ${toolName} is a wallet tool, returning null for UI handling.`
    );
    return null;
  }

  try {
    console.log(`Executing non-wallet tool: ${toolName}`);

    // Check wallet connection for contact-related tools
    if (
      ["addcontact", "getcontact"].includes(toolName.toLowerCase()) &&
      !userWalletAddress
    ) {
      throw new Error("Wallet connection required to manage contacts");
    }

    // Execute different tools based on name
    switch (toolName.toLowerCase()) {
      case "checkportfolio":
        return handleCheckPortfolioTool(args, userWalletAddress);
      case "checkbalance":
        return handleBalanceTool(args, userWalletAddress);
      case "getweather":
        return handleWeatherTool(args);

      case "getlocation":
        return handleLocationTool();

      case "addcontact":
        return handleAddContactTool(args, userWalletAddress);

      case "getcontact":
        return handleGetContactTool(args, userWalletAddress);

      case "displayresults":
        return JSON.stringify({
          success: true,
          data: args,
          message: "Data visualization requested",
        });

      case "fetchtwitterdescription":
        return handleFetchTwitterDescriptionTool(args);

      default:
        return handleGenericTool(toolName);
    }
  } catch (error: any) {
    console.error(`Error executing tool ${toolName}:`, error);
    return JSON.stringify({
      success: false,
      error: error.message || "Tool execution failed",
    });
  }
};

// Individual tool handlers
const handleWeatherTool = async (args: any): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return JSON.stringify({
    success: true,
    data: {
      location: args.city,
      temperature: Math.floor(Math.random() * 30) + 5,
      condition: ["Sunny", "Cloudy", "Rainy", "Snowy"][
        Math.floor(Math.random() * 4)
      ],
      humidity: Math.floor(Math.random() * 100),
      wind: Math.floor(Math.random() * 30),
    },
    message: `Weather information for ${args.city}`,
  });
};

const handleLocationTool = async (): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return JSON.stringify({
    success: true,
    data: {
      city: ["New York", "London", "Tokyo", "Paris"][
        Math.floor(Math.random() * 4)
      ],
      country: ["USA", "UK", "Japan", "France"][Math.floor(Math.random() * 4)],
    },
    message: "Location determined successfully",
  });
};

const handleAddContactTool = async (
  args: any,
  userWalletAddress?: string
): Promise<string> => {
  console.log(`Executing addContact tool for: ${args.name}`);
  const addContactResponse = await fetch("/api/contacts/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userWalletAddress,
      contactName: args.name,
      contactWalletAddress: args.address,
    }),
  });

  const addContactData = await addContactResponse.json();

  if (!addContactResponse.ok) {
    throw new Error(addContactData.error || "Failed to add contact");
  }

  return JSON.stringify(addContactData);
};

const handleGetContactTool = async (
  args: any,
  userWalletAddress?: string
): Promise<string> => {
  console.log(`Executing getContact tool for: ${args.name}`);
  const getContactResponse = await fetch(
    `/api/contacts/get?userWalletAddress=${encodeURIComponent(
      userWalletAddress || ""
    )}&contactName=${encodeURIComponent(args.name)}`
  );

  const getContactData = await getContactResponse.json();

  if (!getContactResponse.ok) {
    // Not found is handled as a result with success: false
    if (getContactResponse.status === 404) {
      return JSON.stringify({
        success: false,
        data: null,
        error: `Contact '${args.name}' not found`,
        message: `No contact found with name ${args.name}`,
      });
    }

    throw new Error(getContactData.error || "Failed to get contact");
  }

  return JSON.stringify(getContactData);
};

const handleGenericTool = async (toolName: string): Promise<string> => {
  console.log(`Executing generic tool: ${toolName}`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return JSON.stringify({
    success: true,
    data: { executed: true, timestamp: new Date().toISOString() },
    message: `Tool ${toolName} executed successfully`,
  });
};

const handleFetchTwitterDescriptionTool = async (
  args: any
): Promise<string> => {
  console.log(`Executing fetchTwitterDescription tool for: ${args.username}`);
  return JSON.stringify({
    success: true,
    data: {
      content: `Week 6 – Quick Update
      
      Overall: -35% (BTC Benchmark: -13.3%)
      
      New Allocation:

      • 50% SOL
      • 50% BTC

      Still waiting for either a BTC retest of 68-70k or a Fed pivot

      No leverage. Vibecoding, reading, sports.

      Love you all 🧡`,
      executed: true,
      timestamp: new Date().toISOString(),
    },
    message: `Twitter description fetched successfully for ${args.username}`,
  });
};

//const handleBalancesTool = async (
//  args: any,
//  userWalletAddress?: string
//): Promise<string> => {
//  console.log(`Executing checkPortfolio tool for: ${userWalletAddress}`);
//  if (!userWalletAddress)
//    return JSON.stringify({
//      success: false,
//      error: "Wallet address is required to check portfolio",
//    });
//  const balances = await FetchBalances(new PublicKey(userWalletAddress));
//  return JSON.stringify({
//    success: true,
//    data: { balances },
//    message: `Balances fetched successfully for ${args.address}`,
//  });
//};

const handleBalanceTool = async (
  args: any,
  userWalletAddress?: string
): Promise<string> => {
  console.log(`Executing checkPortfolio tool for: ${userWalletAddress}`);
  if (!userWalletAddress)
    return JSON.stringify({
      success: false,
      error: "Wallet address is required to check portfolio",
    });
  const balances = await FetchBalances(new PublicKey(userWalletAddress));
  console.log("Balances", balances[addressesToken.get(args.address) ?? ""]);
  return JSON.stringify({
    success: true,
    data: { balance: balances[addressesToken.get(args.address) ?? ""] },
    message: `Balance fetched successfully for ${args.address}`,
  });
};


// ==================================================
//chiliz gpt
// ==================================================

// 1. Client RPC Chiliz
const chilizClient = createPublicClient({
  chain: chiliz,
  transport: http("https://rpc.ankr.com/chiliz"),
});

// 2. Contrats & décimales
const FAN_TOKENS = {
  CHZ:  { address: "native",                                                                  decimals: 18 },
  PSG:  { address: "0xc2661815c69c2b3924d3dd0c2c1358a1e38a3105", decimals: 0 },  // PSG natif
  WPSG: { address: "0x476ef844b3e8318b3bc887a7db07a1a0fede5557", decimals: 18 }, // wrapped PSG
  WBAR:  { address: "0xbaaaef59f4a6c11cc87ff75eaa7a386e753b2666", decimals: 18 },
  CITY: { address: "0x6401b29f40a02578ae44241560625232a01b3f79", decimals: 0 },
};

// 3. ABI minimal ERC-20 (uniquement balanceOf)
const ERC20_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
]);

// 4. Prix approximatifs (hackathon)
const PRICES_USD: Record<string, number> = {
  CHZ: 0.041,
  PSG: 1.61,
  WPSG: 1.14,
  WBAR: 1.14,
  CITY: 0.91,
};

/**
 * handleCheckPortfolioTool
 * Renvoie un JSON stringifié :
 * {
 *   success: true,
 *   data: { totalValueUSD, tokens: [{ symbol, balance, valueUSD }] },
 *   message: "Portfolio fetched successfully"
 * }
 */
export const handleCheckPortfolioTool = async (
  _args: any,
  userWalletAddress?: string
): Promise<string> => {
  console.log("Checking portfolio for:", userWalletAddress);

  if (!userWalletAddress) {
    return JSON.stringify({
      success: false,
      error: "Wallet not connected",
    });
  }

  try {
    const tokens: {
      symbol: string;
      balance: string;
      valueUSD: string;
    }[] = [];
    let totalValueUSD = 0;

    // Boucle sur tous les tokens déclarés
    for (const [symbol, { address, decimals }] of Object.entries(FAN_TOKENS)) {
      let rawBalance: bigint;

      // CHZ natif → getBalance
      if (symbol === "CHZ") {
        rawBalance = await chilizClient.getBalance({
          address: userWalletAddress as `0x${string}`,
        });
      } else {
        // ERC-20 → balanceOf
        try {
          rawBalance = (await chilizClient.readContract({
            address: address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "balanceOf",
            args: [userWalletAddress as `0x${string}`],
          })) as bigint;
        } catch (e) {
          console.error(`⛔️ ${symbol} readContract error`, e);
          continue; // passe au suivant
        }
      }

      const bal = parseFloat(formatUnits(rawBalance, decimals));
      if (bal === 0) continue; // ignore les soldes nuls

      const price = PRICES_USD[symbol] ?? 0;
      const value = bal * price;
      totalValueUSD += value;

      tokens.push({
        symbol,
        balance: bal.toFixed(decimals > 0 ? 4 : 0),
        valueUSD: value.toFixed(2),
      });
    }

    console.log("❤️ Portfolio tokens:", tokens);
    return JSON.stringify({
      success: true,
      data: {
        totalValueUSD: totalValueUSD.toFixed(2),
        tokens,
      },
      message: "Portfolio fetched successfully",
    });
  } catch (err: any) {
    console.error("Portfolio check error:", err);
    return JSON.stringify({
      success: false,
      error: err?.message ?? "Failed to fetch portfolio",
    });
  }
};