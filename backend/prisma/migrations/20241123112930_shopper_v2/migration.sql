/*
  Warnings:

  - You are about to drop the column `driver` on the `RideConfirmation` table. All the data in the column will be lost.
  - Added the required column `driver_id` to the `RideConfirmation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RideConfirmation" DROP COLUMN "driver",
ADD COLUMN     "driver_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "RideConfirmation" ADD CONSTRAINT "RideConfirmation_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE;
