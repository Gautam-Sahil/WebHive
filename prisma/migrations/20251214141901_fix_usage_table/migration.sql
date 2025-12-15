/*
  Warnings:

  - Made the column `expire` on table `Usage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usage" ALTER COLUMN "expire" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Usage_expire_idx" ON "Usage"("expire");
