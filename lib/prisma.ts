import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient | null = null;

export const getPrisma = (): PrismaClient => {
  if (prismaInstance) {
    return prismaInstance;
  }

  prismaInstance = globalForPrisma.prisma ||
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }

  return prismaInstance;
};

// For backwards compatibility with existing imports
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    return Reflect.get(getPrisma(), prop);
  },
});
