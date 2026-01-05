/*
  Warnings:

  - You are about to drop the `PlaceImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlaceImage" DROP CONSTRAINT "PlaceImage_placeId_fkey";

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "imageUrl" TEXT;

-- DropTable
DROP TABLE "PlaceImage";
