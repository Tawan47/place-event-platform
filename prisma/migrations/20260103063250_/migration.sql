/*
  Warnings:

  - You are about to drop the column `latitude` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Place` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Event_sourceName_sourceUrl_key";

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Cafe',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "mapUrl" TEXT,
ADD COLUMN     "openTime" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "travelInfo" DROP NOT NULL;
