/*
  Warnings:

  - You are about to drop the column `delivery_datetime` on the `loads` table. All the data in the column will be lost.
  - You are about to drop the column `pickup_datetime` on the `loads` table. All the data in the column will be lost.
  - Added the required column `delivery_end` to the `loads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delivery_start` to the `loads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickup_end` to the `loads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickup_start` to the `loads` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."loads_delivery_datetime_idx";

-- DropIndex
DROP INDEX "public"."loads_pickup_datetime_idx";

-- AlterTable
ALTER TABLE "loads" DROP COLUMN "delivery_datetime",
DROP COLUMN "pickup_datetime",
ADD COLUMN     "delivery_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "delivery_start" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pickup_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pickup_start" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "loads_pickup_start_idx" ON "loads"("pickup_start");

-- CreateIndex
CREATE INDEX "loads_pickup_end_idx" ON "loads"("pickup_end");

-- CreateIndex
CREATE INDEX "loads_delivery_start_idx" ON "loads"("delivery_start");

-- CreateIndex
CREATE INDEX "loads_delivery_end_idx" ON "loads"("delivery_end");
