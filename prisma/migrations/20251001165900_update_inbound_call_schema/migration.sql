/*
  Warnings:

  - You are about to drop the column `call_duration_seconds` on the `inbound_calls` table. All the data in the column will be lost.
  - You are about to drop the column `call_end_time` on the `inbound_calls` table. All the data in the column will be lost.
  - You are about to drop the column `call_start_time` on the `inbound_calls` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."inbound_calls_call_end_time_idx";

-- DropIndex
DROP INDEX "public"."inbound_calls_call_start_time_idx";

-- AlterTable
ALTER TABLE "inbound_calls" DROP COLUMN "call_duration_seconds",
DROP COLUMN "call_end_time",
DROP COLUMN "call_start_time";
