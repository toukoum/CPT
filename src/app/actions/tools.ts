// app/actions/tools.ts
'use server'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetches all tools accessible to a user, including:
 * - User created tools
 * - Default system tools
 */
export async function fetchUserTools(walletAddress: string) {
  try {
    // Find user by wallet address
    const user = await prisma.user.findUnique({
      where: {
        walletAddress,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Fetch tools owned by the user
    const userCreatedTools = await prisma.tool.findMany({
      where: {
        creatorId: user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
          },
        },
        parameters: true,
        attributes: true,
      },
    });

    // Fetch default tools
    const defaultTools = await prisma.tool.findMany({
      where: {
        isDefault: true,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
          },
        },
        parameters: true,
        attributes: true,
      },
    });


    const processedIds = new Set();
    const allTools: ReturnType<typeof formatToolResponse>[] = [];

    // Process user created tools first
    userCreatedTools.forEach(tool => {
      allTools.push(formatToolResponse(tool));
      processedIds.add(tool.id);
    });

    // Only add default tools that aren't already included
    defaultTools.forEach(tool => {
      if (!processedIds.has(tool.id)) {
        allTools.push(formatToolResponse(tool));
      }
    });

    return allTools;
  } catch (error) {
    console.error('Error fetching tools:', error);
    throw new Error('Failed to fetch tools');
  }
}

/**
 * Fetches only tools created by the user
 */
export async function fetchCreatedTools(walletAddress: string) {
  try {
    // Find user by wallet address
    const user = await prisma.user.findUnique({
      where: {
        walletAddress,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Fetch tools owned by the user
    const userCreatedTools = await prisma.tool.findMany({
      where: {
        creatorId: user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
          },
        },
        parameters: true,
        attributes: true,
      },
    });

    // Format the response
    return userCreatedTools.map(formatToolResponse);
  } catch (error) {
    console.error('Error fetching created tools:', error);
    throw new Error('Failed to fetch created tools');
  }
}

/**
 * Fetches only default system tools
 */
export async function fetchDefaultTools() {
  try {
    // Fetch default tools
    const defaultTools = await prisma.tool.findMany({
      where: {
        isDefault: true,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
          },
        },
        parameters: true,
        attributes: true,
      },
    });

    // Format the response
    return defaultTools.map(formatToolResponse);
  } catch (error) {
    console.error('Error fetching default tools:', error);
    throw new Error('Failed to fetch default tools');
  }
}

/**
 * Helper function to format tool response
 */
function formatToolResponse(tool: any) {
  // Convert parameters to expected structure
  const parameters = {
    params: tool.parameters.map((param: any) => ({
      name: param.name,
      type: param.type,
      description: param.description,
      required: param.required,
    }))
  };

  return {
    id: tool.id,
    name: tool.name,
    description: tool.description,
    image: tool.image,
    price: 0, // Add price if needed
    category: tool.category,
    parameters,
    published: tool.published,
    createdAt: tool.createdAt.toISOString(),
    creator: {
      id: tool.creator.id,
      name: tool.creator.name,
      walletAddress: tool.creator.walletAddress,
    },
    isDefault: tool.isDefault,
    enabled: tool.enabled,
    hasExecutionCode: true, // Assuming all tools have execution code
  };
}

/**
 * Updates a tool's enabled status
 */
export async function updateToolStatus(id: string, enabled: boolean) {
  try {
    const updatedTool = await prisma.tool.update({
      where: {
        id,
      },
      data: {
        enabled,
      },
    });

    return { success: true, tool: updatedTool };
  } catch (error) {
    console.error('Error updating tool status:', error);
    return { success: false, error: 'Failed to update tool status' };
  }
}

/**
 * Fetches all tools accessible to a user, optimized for the tools drawer
 * This version provides just the essential data needed for the drawer
 */
export async function fetchToolsForDrawer(walletAddress: string) {
  try {
    // Find user by wallet address
    const user = await prisma.user.findUnique({
      where: {
        walletAddress,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Fetch tools owned by the user
    const userCreatedTools = await prisma.tool.findMany({
      where: {
        creatorId: user.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        image: true,
        isDefault: true,
        enabled: true,
        parameters: {
          select: {
            name: true,
            type: true,
            required: true,
          }
        },
        createdAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
          },
        },
      },
    });

    // Fetch default tools
    const defaultTools = await prisma.tool.findMany({
      where: {
        isDefault: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        isDefault: true,
        image: true,
        enabled: true,
        parameters: {
          select: {
            name: true,
            type: true,
            required: true,
          }
        },
        createdAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
          },
        },
      },
    });

    // Format tools for the drawer
    const formatTools = (tools: any[]) => tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      image: tool.image,
      isDefault: tool.isDefault,
      enabled: tool.enabled ?? true,
      parameters: {
        params: tool.parameters.map((param: any) => ({
          name: param.name,
          type: param.type,
          required: param.required,
        }))
      },
      createdAt: tool.createdAt.toISOString(),
      creator: {
        id: tool.creator.id,
        name: tool.creator.name,
        walletAddress: tool.creator.walletAddress,
      },
    }));

    // Combine all tools
    const formattedUserTools = formatTools(userCreatedTools);
    const formattedDefaultTools = formatTools(defaultTools);
    const allTools = [...formattedUserTools, ...formattedDefaultTools];

    return allTools;
  } catch (error) {
    console.error('Error fetching tools for drawer:', error);
    throw new Error('Failed to fetch tools');
  }
}