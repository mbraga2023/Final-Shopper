-- CreateTable
CREATE TABLE "Driver" (
    "driver_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "car" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "minKm" INTEGER NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("driver_id")
);

-- CreateTable
CREATE TABLE "RideConfirmation" (
    "id" SERIAL NOT NULL,
    "customer_id" TEXT NOT NULL,
    "origin" JSONB NOT NULL,
    "destination" JSONB NOT NULL,
    "distance" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "driver" JSONB NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RideConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
