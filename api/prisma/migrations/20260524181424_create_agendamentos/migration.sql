/*
  Warnings:

  - The primary key for the `_PerfilToPermissao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_PerfilToUsuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_PerfilToPermissao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_PerfilToUsuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_PerfilToPermissao" DROP CONSTRAINT "_PerfilToPermissao_AB_pkey";

-- AlterTable
ALTER TABLE "_PerfilToUsuario" DROP CONSTRAINT "_PerfilToUsuario_AB_pkey";

-- CreateTable
CREATE TABLE "Espaco" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "icone" TEXT NOT NULL,
    "cor" TEXT NOT NULL,

    CONSTRAINT "Espaco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" SERIAL NOT NULL,
    "data_reserva" TIMESTAMP(3) NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "espaco_id" INTEGER NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "_PerfilToPermissao_AB_unique" ON "_PerfilToPermissao"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_PerfilToUsuario_AB_unique" ON "_PerfilToUsuario"("A", "B");

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_espaco_id_fkey" FOREIGN KEY ("espaco_id") REFERENCES "Espaco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
