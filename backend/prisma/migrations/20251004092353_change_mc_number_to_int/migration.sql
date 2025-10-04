-- AlterTable
ALTER TABLE "inbound_calls" ADD COLUMN "mc_number" INTEGER;

-- CreateIndex
CREATE INDEX "inbound_calls_mc_number_idx" ON "inbound_calls"("mc_number");

