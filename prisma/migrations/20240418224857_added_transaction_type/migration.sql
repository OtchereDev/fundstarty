/*
  Warnings:

  - Changed the type of `transType` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "transType",
ADD COLUMN     "transType" "TransactionType" NOT NULL;
