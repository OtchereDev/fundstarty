/*
  Warnings:

  - You are about to drop the `_CategoryToFundraiser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToFundraiser" DROP CONSTRAINT "_CategoryToFundraiser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToFundraiser" DROP CONSTRAINT "_CategoryToFundraiser_B_fkey";

-- DropTable
DROP TABLE "_CategoryToFundraiser";

-- AddForeignKey
ALTER TABLE "Fundraiser" ADD CONSTRAINT "Fundraiser_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
