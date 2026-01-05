/*
  Warnings:

  - Added the required column `stationCode` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "stationCode" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
