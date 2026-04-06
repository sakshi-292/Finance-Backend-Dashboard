-- AlterTable
ALTER TABLE "financial_records" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "financial_records_isDeleted_idx" ON "financial_records"("isDeleted");
