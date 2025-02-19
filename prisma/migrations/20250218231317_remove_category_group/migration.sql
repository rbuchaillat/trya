/*
  Warnings:

  - The primary key for the `BankAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryGroupId` on the `Category` table. All the data in the column will be lost.
  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `CategoryGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_item_id_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_categoryGroupId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_account_id_fkey";

-- AlterTable
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "item_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "categoryGroupId";

-- AlterTable
ALTER TABLE "Item" DROP CONSTRAINT "Item_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "account_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "CategoryGroup";

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
