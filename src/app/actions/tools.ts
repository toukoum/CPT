// app/actions/tools.ts
'use server'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetches all tools accessible to a user, including:
 * - User created tools
 * - Default system tools
 */
    const formattedUserTools = formatTools(userCreatedTools);
    const formattedDefaultTools = formatTools(defaultTools);
    const allTools = [...formattedUserTools, ...formattedDefaultTools];

    return allTools;
  } catch (error) {
    console.error('Error fetching tools for drawer:', error);
    throw new Error('Failed to fetch tools');
  }
}