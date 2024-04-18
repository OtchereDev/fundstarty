/*
  Warnings:

  - You are about to drop the column `fundraiserId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_fundraiserId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "fundraiserId";

-- CreateTable
CREATE TABLE "_CategoryToFundraiser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToFundraiser_AB_unique" ON "_CategoryToFundraiser"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToFundraiser_B_index" ON "_CategoryToFundraiser"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToFundraiser" ADD CONSTRAINT "_CategoryToFundraiser_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToFundraiser" ADD CONSTRAINT "_CategoryToFundraiser_B_fkey" FOREIGN KEY ("B") REFERENCES "Fundraiser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
