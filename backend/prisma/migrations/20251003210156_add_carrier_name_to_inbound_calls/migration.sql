-- AlterTable
ALTER TABLE "inbound_calls" ADD COLUMN "carrier_name" TEXT;

-- CreateIndex
CREATE INDEX "inbound_calls_carrier_name_idx" ON "inbound_calls"("carrier_name");
