/*
  Warnings:

  - You are about to drop the column `expiryMonth` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `expiryYear` on the `Wallet` table. All the data in the column will be lost.
  - Added the required column `expiryDate` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "expiryMonth",
DROP COLUMN "expiryYear",
ADD COLUMN     "expiryDate" TEXT NOT NULL;
