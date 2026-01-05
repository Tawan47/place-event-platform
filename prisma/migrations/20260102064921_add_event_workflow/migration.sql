/*
  Warnings:

  - A unique constraint covering the columns `[sourceName,sourceUrl]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sourceName` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceType` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceUrl` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventSourceType" AS ENUM ('INTERNAL', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'REJECTED');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "sourceName" TEXT NOT NULL,
ADD COLUMN     "sourceType" "EventSourceType" NOT NULL,
ADD COLUMN     "sourceUrl" TEXT NOT NULL,
ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE UNIQUE INDEX "Event_sourceName_sourceUrl_key" ON "Event"("sourceName", "sourceUrl");
