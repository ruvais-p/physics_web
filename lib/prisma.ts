import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function hasCurrentSchema(client: PrismaClient): boolean {
  const runtimeClient = client as unknown as Record<string, unknown>;

  return Boolean(
    runtimeClient.pageHero &&
    runtimeClient.news &&
    runtimeClient.award
  );
}

const cachedPrisma = globalForPrisma.prisma;

// Turbopack preserves globalThis across hot reloads. If Prisma was generated
// after the dev server started, replace the cached instance so new model
// delegates (such as pageHero) become available without another crash.
if (cachedPrisma && !hasCurrentSchema(cachedPrisma)) {
  void cachedPrisma.$disconnect().catch(() => undefined);
}

export const prisma = cachedPrisma && hasCurrentSchema(cachedPrisma)
  ? cachedPrisma
  : new PrismaClient({
    // Avoid logging query parameters that can contain personal or authentication data.
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
