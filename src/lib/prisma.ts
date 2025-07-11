import { PrismaClient } from '@prisma/client';

// PrismaClient est attaché à la variable globale en développement pour éviter 
// d'épuiser la limite de connexions à la DB pendant le hot-reload
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;