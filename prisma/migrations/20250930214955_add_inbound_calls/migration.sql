-- CreateEnum
CREATE TYPE "CallOutcome" AS ENUM ('TRANSFERRED', 'CANCELED');

-- CreateEnum
CREATE TYPE "CallerSentiment" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- CreateTable
CREATE TABLE "inbound_calls" (
    "call_id" TEXT NOT NULL,
    "call_start_time" TIMESTAMP(3) NOT NULL,
    "call_end_time" TIMESTAMP(3) NOT NULL,
    "call_duration_seconds" INTEGER NOT NULL,
    "outcome" "CallOutcome" NOT NULL,
    "caller_sentiment" "CallerSentiment" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inbound_calls_pkey" PRIMARY KEY ("call_id")
);

-- CreateIndex
CREATE INDEX "inbound_calls_call_start_time_idx" ON "inbound_calls"("call_start_time");

-- CreateIndex
CREATE INDEX "inbound_calls_call_end_time_idx" ON "inbound_calls"("call_end_time");

-- CreateIndex
CREATE INDEX "inbound_calls_outcome_idx" ON "inbound_calls"("outcome");

-- CreateIndex
CREATE INDEX "inbound_calls_caller_sentiment_idx" ON "inbound_calls"("caller_sentiment");

-- CreateIndex
CREATE INDEX "inbound_calls_created_at_idx" ON "inbound_calls"("created_at");
