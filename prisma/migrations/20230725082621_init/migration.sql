/*
  Warnings:

  - You are about to drop the column `email_authentication` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phonenumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phonenumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `email_authentication`,
    DROP COLUMN `phone_number`,
    ADD COLUMN `emailAuthentication` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `phonenumber` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_phonenumber_key` ON `User`(`phonenumber`);
