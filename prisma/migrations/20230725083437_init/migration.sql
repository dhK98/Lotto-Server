/*
  Warnings:

  - You are about to drop the column `emailAuthentication` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `emailAuthentication`,
    ADD COLUMN `email_authentication` BOOLEAN NOT NULL DEFAULT false;
