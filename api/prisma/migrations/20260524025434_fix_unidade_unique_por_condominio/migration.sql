/*
  Warnings:

  - A unique constraint covering the columns `[unidade,condominio_id]` on the table `UNIDADES` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UNIDADES_unidade_key";

-- AlterTable
ALTER TABLE "_PerfilToPermissao" ADD CONSTRAINT "_PerfilToPermissao_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PerfilToPermissao_AB_unique";

-- AlterTable
ALTER TABLE "_PerfilToUsuario" ADD CONSTRAINT "_PerfilToUsuario_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PerfilToUsuario_AB_unique";

-- CreateIndex
CREATE UNIQUE INDEX "UNIDADES_unidade_condominio_id_key" ON "UNIDADES"("unidade", "condominio_id");
