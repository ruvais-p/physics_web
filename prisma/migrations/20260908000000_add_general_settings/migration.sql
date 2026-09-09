CREATE TABLE "GeneralSettings" (
    "id" TEXT NOT NULL DEFAULT 'general',
    "departmentEmail" TEXT,
    "departmentEmailAppPassword" TEXT,
    "hodEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneralSettings_pkey" PRIMARY KEY ("id")
);
