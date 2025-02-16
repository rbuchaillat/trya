/*
  Warnings:

  - You are about to drop the column `isCreatedOnBridge` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[bridgeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserToken" DROP CONSTRAINT "UserToken_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isCreatedOnBridge",
ADD COLUMN     "bridgeId" TEXT;

-- DropTable
DROP TABLE "UserToken";

-- CreateTable
CREATE TABLE "BridgeToken" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BridgeToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" BIGINT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "provider_name" TEXT,
    "provider_group_name" TEXT,
    "provider_images_logo" TEXT,
    "status" INTEGER NOT NULL,
    "status_code_info" TEXT,
    "status_code_description" TEXT,
    "account_types" TEXT NOT NULL,
    "last_successful_refresh" TIMESTAMP(3),
    "last_try_refresh" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "accounting_balance" DOUBLE PRECISION,
    "instant_balance" DOUBLE PRECISION,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_refresh_status" TEXT,
    "type" TEXT NOT NULL,
    "currency_code" TEXT NOT NULL,
    "item_id" BIGINT NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "loan_details" JSONB,
    "pro" BOOLEAN,
    "data_access" TEXT,
    "iban" TEXT,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" BIGINT NOT NULL,
    "clean_description" TEXT NOT NULL,
    "provider_description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency_code" TEXT NOT NULL,
    "deleted" BOOLEAN,
    "category_id" INTEGER,
    "operation_type" TEXT NOT NULL,
    "account_id" BIGINT NOT NULL,
    "future" BOOLEAN,
    "date" TEXT,
    "booking_date" TEXT,
    "transaction_date" TEXT,
    "value_date" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BridgeToken_userId_key" ON "BridgeToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_bridgeId_key" ON "User"("bridgeId");

-- AddForeignKey
ALTER TABLE "BridgeToken" ADD CONSTRAINT "BridgeToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("bridgeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
