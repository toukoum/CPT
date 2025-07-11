// src/app/api/user/[walletAddress]/tools/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';


export async function GET(
  request: NextRequest,
  { params }: { params: { walletAddress: string } }
) {
  try {
    const walletAddress = params.walletAddress;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Find user by wallet address
    const user = await prisma.user.findUnique({
      where: {
        walletAddress,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch tools owned by the user
    const ownedTools = await prisma.tool.findMany({
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

    // Format the response for user tools
    const formattedUserTools = ownedTools.map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      image: tool.image,
      category: tool.category,
      parameters: {
        params: tool.parameters.map(param => ({
          name: param.name,
          type: param.type,
          description: param.description,
          required: param.required,
        }))
      },
      attributes: tool.attributes,
      published: tool.published,
      createdAt: tool.createdAt,
      creator: {
        id: tool.creator.id,
        name: tool.creator.name,
        walletAddress: tool.creator.walletAddress,
      },
      isDefault: false,
      enabled: tool.enabled,
      hasExecutionCode: true,
    }));

    // Format the response for default tools
    const formattedDefaultTools = defaultTools.map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      image: tool.image,
      category: tool.category,
      parameters: {
        params: tool.parameters.map(param => ({
          name: param.name,
          type: param.type,
          description: param.description,
          required: param.required,
        }))
      },
      attributes: tool.attributes,
      published: tool.published,
      createdAt: tool.createdAt,
      creator: {
        id: tool.creator.id,
        name: tool.creator.name,
        walletAddress: tool.creator.walletAddress,
      },
      isDefault: true,
      enabled: tool.enabled,
      hasExecutionCode: true,
    }));

    // Combine both types of tools
    const allTools = [...formattedUserTools, ...formattedDefaultTools];

    return NextResponse.json(allTools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}