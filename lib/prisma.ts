import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function hasCurrentSchema(client: PrismaClient): boolean {
  const runtimeClient = client as unknown as Record<string, unknown>;

  const hasModels = Boolean(
    runtimeClient.pageHero &&
    runtimeClient.news &&
    runtimeClient.award &&
    runtimeClient.staff
  );

  const runtimeDataModel = (client as unknown as {
    _runtimeDataModel?: {
      models?: {
        Faculty?: { fields?: Array<{ name: string }> };
        FacultyStudent?: { fields?: Array<{ name: string }> };
        ResearchLab?: { fields?: Array<{ name: string }> };
        Facility?: { fields?: Array<{ name: string }> };
      };
    };
  })._runtimeDataModel;
  const facultyFields = runtimeDataModel?.models?.Faculty?.fields?.map((f) => f.name) || [];
  const hasFacultyFields = facultyFields.includes('qualification') && facultyFields.includes('room');

  const studentFields = runtimeDataModel?.models?.FacultyStudent?.fields?.map((f) => f.name) || [];
  const hasStudentFields = studentFields.includes('expiryDate');

  const labFields = runtimeDataModel?.models?.ResearchLab?.fields?.map((f) => f.name) || [];
  const hasLabSortOrder = labFields.includes('sortOrder');

  const facilityFields = runtimeDataModel?.models?.Facility?.fields?.map((f) => f.name) || [];
  const hasFacilitySortOrder = facilityFields.includes('sortOrder');

  return hasModels && hasFacultyFields && hasStudentFields && hasLabSortOrder && hasFacilitySortOrder;
}

const cachedPrisma = globalForPrisma.prisma;

// Turbopack preserves globalThis across hot reloads. If Prisma was generated
// after the dev server started, replace the cached instance so new model
// delegates (such as pageHero) become available without another crash.
if (cachedPrisma && !hasCurrentSchema(cachedPrisma)) {
  void cachedPrisma.$disconnect().catch(() => undefined);
}

export const prisma =
  cachedPrisma && hasCurrentSchema(cachedPrisma)
    ? cachedPrisma
    : new PrismaClient({
        // Avoid logging query parameters that can contain personal or authentication data.
        log: ['error'],
      });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
