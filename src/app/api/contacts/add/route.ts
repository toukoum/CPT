// src/app/api/contacts/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userWalletAddress, contactName, contactWalletAddress } = await req.json();
    
    if (!userWalletAddress || !contactName || !contactWalletAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Validate contact name (min 3 characters)
    if (contactName.length < 3) {
      return NextResponse.json(
        { error: "Contact name must be at least 3 characters" },
        { status: 400 }
      );
    }
    
    // Validate wallet address format (basic check for Solana address)
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(contactWalletAddress)) {
      return NextResponse.json(
        { error: "Invalid Solana wallet address format" },
        { status: 400 }
      );
    }

    // Get user by wallet address
    const user = await prisma.user.findUnique({
      where: { walletAddress: userWalletAddress },
    });

    // If user doesn't exist, create one
    let userId;
    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          walletAddress: userWalletAddress,
        },
      });
      userId = newUser.id;
    } else {
      userId = user.id;
    }

    // Check if contact with this name already exists for this user
    const existingContact = await prisma.contact.findFirst({
      where: {
        userId: userId,
        name: {
          equals: contactName,
          mode: 'insensitive', // Case insensitive
        },
      },
    });

    if (existingContact) {
      return NextResponse.json(
        { error: "A contact with this name already exists" },
        { status: 400 }
      );
    }

    // Create new contact
    const contact = await prisma.contact.create({
      data: {
        name: contactName,
        walletAddress: contactWalletAddress,
        userId: userId,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        contactId: contact.id,
        name: contact.name,
        walletAddress: contact.walletAddress,
        added: contact.createdAt.toISOString(),
      },
      message: `Contact ${contactName} was added successfully`,
    });
  } catch (error: any) {
    console.error("Error adding contact:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add contact" },
      { status: 500 }
    );
  }
}