/*
  Warnings:

  - Made the column `data_nascimento` on table `MORADORES` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FUNCIONARIOS" ALTER COLUMN "data_nascimento" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "MORADORES" ALTER COLUMN "data_nascimento" SET NOT NULL,
ALTER COLUMN "data_nascimento" SET DATA TYPE TEXT;
