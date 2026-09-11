-- Preserve existing event dates while moving to the start/end date model.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'events'
      AND column_name = 'date'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'events'
      AND column_name = 'start_date'
  ) THEN
    ALTER TABLE "events" RENAME COLUMN "date" TO "start_date";
  END IF;
END $$;

ALTER TABLE "events"
  ADD COLUMN IF NOT EXISTS "end_date" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "broadcast_id" TEXT,
  ADD COLUMN IF NOT EXISTS "brochure" TEXT;

DROP INDEX IF EXISTS "events_date_idx";
CREATE INDEX IF NOT EXISTS "events_start_date_idx"
ON "events"("start_date" DESC);

-- These models were added to schema.prisma without a corresponding migration.
CREATE TABLE IF NOT EXISTS "PageHero" (
  "id" TEXT NOT NULL,
  "pageKey" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PageHero_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PageHero_pageKey_key"
ON "PageHero"("pageKey");

CREATE INDEX IF NOT EXISTS "PageHero_pageKey_idx"
ON "PageHero"("pageKey");

CREATE TABLE IF NOT EXISTS "Award" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "image" TEXT,
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "link" TEXT,
  "broadcastId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Award_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Award_date_createdAt_idx"
ON "Award"("date" DESC, "createdAt" DESC);

CREATE TABLE IF NOT EXISTS "News" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "image" TEXT,
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "link" TEXT,
  "broadcastId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "News_date_createdAt_idx"
ON "News"("date" DESC, "createdAt" DESC);
