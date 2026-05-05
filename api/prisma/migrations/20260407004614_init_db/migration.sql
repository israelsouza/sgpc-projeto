/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `FUNCIONARIOS` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `celular` to the `FUNCIONARIOS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `FUNCIONARIOS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_nascimento` to the `FUNCIONARIOS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome_completo` to the `FUNCIONARIOS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rg` to the `FUNCIONARIOS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FUNCIONARIOS" ADD COLUMN     "celular" TEXT NOT NULL,
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "data_nascimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nome_completo" TEXT NOT NULL,
ADD COLUMN     "rg" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PERMISSOES" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "PERMISSOES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PerfilToPermissao" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PERMISSOES_nome_key" ON "PERMISSOES"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "_PerfilToPermissao_AB_unique" ON "_PerfilToPermissao"("A", "B");

-- CreateIndex
CREATE INDEX "_PerfilToPermissao_B_index" ON "_PerfilToPermissao"("B");

-- CreateIndex
CREATE UNIQUE INDEX "FUNCIONARIOS_cpf_key" ON "FUNCIONARIOS"("cpf");

-- AddForeignKey
ALTER TABLE "_PerfilToPermissao" ADD CONSTRAINT "_PerfilToPermissao_A_fkey" FOREIGN KEY ("A") REFERENCES "PERFIS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PerfilToPermissao" ADD CONSTRAINT "_PerfilToPermissao_B_fkey" FOREIGN KEY ("B") REFERENCES "PERMISSOES"("id") ON DELETE CASCADE ON UPDATE CASCADE;
