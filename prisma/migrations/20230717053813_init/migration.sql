/*
  Warnings:

  - You are about to drop the column `phone_authentication` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `phone_authentication`,
    ADD COLUMN `email_authentication` BOOLEAN NOT NULL DEFAULT false;
