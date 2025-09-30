-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('DRY_VAN', 'REFRIGERATED', 'FLATBED', 'TANKER', 'CONTAINER');

-- CreateTable
CREATE TABLE "loads" (
    "load_id" TEXT NOT NULL,
    "origin_city" TEXT NOT NULL,
    "destination_city" TEXT NOT NULL,
    "pickup_datetime" TIMESTAMP(3) NOT NULL,
    "delivery_datetime" TIMESTAMP(3) NOT NULL,
    "equipment_type" "EquipmentType" NOT NULL,
    "loadboard_rate" DECIMAL(65,30) NOT NULL,
    "notes" TEXT,
    "weight" DECIMAL(65,30),
    "commodity_type" TEXT,
    "num_of_pieces" INTEGER,
    "miles" DECIMAL(65,30),
    "dimensions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loads_pkey" PRIMARY KEY ("load_id")
);

-- CreateIndex
CREATE INDEX "loads_origin_city_idx" ON "loads"("origin_city");

-- CreateIndex
CREATE INDEX "loads_destination_city_idx" ON "loads"("destination_city");

-- CreateIndex
CREATE INDEX "loads_pickup_datetime_idx" ON "loads"("pickup_datetime");

-- CreateIndex
CREATE INDEX "loads_delivery_datetime_idx" ON "loads"("delivery_datetime");

-- CreateIndex
CREATE INDEX "loads_equipment_type_idx" ON "loads"("equipment_type");

-- CreateIndex
CREATE INDEX "loads_loadboard_rate_idx" ON "loads"("loadboard_rate");

-- CreateIndex
CREATE INDEX "loads_commodity_type_idx" ON "loads"("commodity_type");
