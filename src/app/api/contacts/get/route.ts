// src/app/api/contacts/get/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Add this line to mark the route as dynamic
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(req.url);
    const userWalletAddress = url.searchParams.get("userWalletAddress");
    const contactName = url.searchParams.get("contactName");
    
    if (!userWalletAddress) {
      return NextResponse.json(
        { error: "Missing user wallet address" },
        { status: 400 }
      );
    }
    
    if (!contactName) {
      return NextResponse.json(
        { error: "Missing contact name" },
        { status: 400 }
      );
    }

    // Get user by wallet address
    const user = await prisma.user.findUnique({
      where: { walletAddress: userWalletAddress },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Find contact by name (case insensitive)
    const contact = await prisma.contact.findFirst({
      where: {
        userId: user.id,
        name: {
          equals: contactName,
          mode: 'insensitive', // Case insensitive
        },
      },
    });

    if (!contact) {
      return NextResponse.json({
        success: false,
        error: `No contact found with name ${contactName}`,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        contactId: contact.id,
        name: contact.name,
        walletAddress: contact.walletAddress,
      },
      message: `Contact found: ${contact.name}`,
    });
  } catch (error: any) {
    console.error("Error getting contact:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get contact" },
      { status: 500 }
    );
  }
}