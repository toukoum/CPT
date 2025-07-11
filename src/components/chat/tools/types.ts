// src/components/chat/tools/types.ts
// Define the shape of a tool invocation from AI
export interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  state: 'partial-call' | 'call' | 'result';
  result?: string;
  args?: Record<string, any>;
}

// Define the shape of a tool result
export interface ToolResult {
  success: boolean;
  txHash?: string;
  error?: string;
  data?: any;
  message?: string;
}
// src/components/chat/tools/types.ts

// Transaction states for all tool types
export enum TransactionState {
  WAITING_CONFIRMATION = 'waiting_confirmation',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed'
}

// Tool categories
export enum ToolCategory {
  WALLET = 'wallet',
  DATA = 'data',
  UTILITY = 'utility',
  SOCIAL = 'social'
}

// Define the shape of a tool invocation from AI
export interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  state: 'partial-call' | 'call' | 'result';
  result?: string;
  args?: Record<string, any>;
}

// Define the shape of a tool result
export interface ToolResult {
  success: boolean;
  txHash?: string;
  error?: string;
  data?: any;
  message?: string;
}

// A registry of tools by category
export const TOOL_REGISTRY: Record<string, ToolCategory> = {
  // Wallet tools
  'send': ToolCategory.WALLET,
  'swap': ToolCategory.WALLET,
  'bridge': ToolCategory.WALLET,
  'stake': ToolCategory.WALLET,
  'convert': ToolCategory.WALLET,
  
  // Utility tools
  'checkPortfolio':ToolCategory.UTILITY,
  'checkTokenBalance':ToolCategory.UTILITY,
  'getweather': ToolCategory.UTILITY,
  'getlocation': ToolCategory.UTILITY,
  
  // Social tools - Add our new contact tools here
  'addcontact': ToolCategory.SOCIAL,
  'getcontact': ToolCategory.SOCIAL,
  
  // Data tools
  'visualizedata': ToolCategory.DATA,
  'generatechart': ToolCategory.DATA
};

// Helper to determine tool category
export function getToolCategory(toolName: string): ToolCategory {
  return TOOL_REGISTRY[toolName.toLowerCase()] || ToolCategory.UTILITY;
}

// Helper to check if tool is a wallet tool
export function isWalletTool(toolName: string): boolean {
  return getToolCategory(toolName) === ToolCategory.WALLET;
}