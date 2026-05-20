/*
  Warnings:

  - The `tipoCond` column on the `CONDOMINIOS` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TipoCondominio" AS ENUM ('PREDIO', 'HORIZONTAL');

-- AlterTable
ALTER TABLE "CONDOMINIOS" DROP COLUMN "tipoCond",
ADD COLUMN     "tipoCond" "TipoCondominio" NOT NULL DEFAULT 'PREDIO';
