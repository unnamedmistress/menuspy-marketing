CREATE TABLE "Permit" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "estimatedDays" INTEGER NOT NULL,
  "estimatedCost" INTEGER,
  "squareFootage" INTEGER,
  "jurisdiction" TEXT NOT NULL,
  "submittedAt" DATETIME,
  "approvedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Prediction" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "permitType" TEXT NOT NULL,
  "confidence" INTEGER NOT NULL,
  "triggerType" TEXT NOT NULL,
  "requiredDocs" TEXT NOT NULL,
  "estimatedDays" INTEGER NOT NULL,
  "rationale" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "HistoricalPermit" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "permitType" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "squareFootage" INTEGER,
  "complexity" INTEGER NOT NULL,
  "daysToApproval" INTEGER NOT NULL,
  "submissionMonth" INTEGER NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Permit_type_status_idx" ON "Permit"("type", "status");
CREATE INDEX "Prediction_permitType_createdAt_idx" ON "Prediction"("permitType", "createdAt");
CREATE INDEX "HistoricalPermit_permitType_location_idx" ON "HistoricalPermit"("permitType", "location");
