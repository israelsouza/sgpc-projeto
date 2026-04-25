/*
  Warnings:

  - You are about to drop the column `atualizado_em` on the `CHAVES_ACESSO` table. All the data in the column will be lost.
  - You are about to drop the column `quem_atualizou` on the `MORADORES` table. All the data in the column will be lost.
  - You are about to drop the column `quem_atualizou` on the `UNIDADES` table. All the data in the column will be lost.
  - You are about to drop the column `quem_atualizou` on the `USUARIOS` table. All the data in the column will be lost.
  - You are about to drop the column `quem_criou` on the `USUARIOS` table. All the data in the column will be lost.
  - Added the required column `condominio_id` to the `CHAVES_ACESSO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perfil_id` to the `CHAVES_ACESSO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condominio_id` to the `UNIDADES` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CHAVES_ACESSO" DROP COLUMN "atualizado_em",
ADD COLUMN     "condominio_id" INTEGER NOT NULL,
ADD COLUMN     "perfil_id" INTEGER NOT NULL,
ADD COLUMN     "unidade_id" INTEGER;

-- AlterTable
ALTER TABLE "MORADORES" DROP COLUMN "quem_atualizou",
ADD COLUMN     "deletado_em" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UNIDADES" DROP COLUMN "quem_atualizou",
ADD COLUMN     "condominio_id" INTEGER NOT NULL,
ADD COLUMN     "deletado_em" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "USUARIOS" DROP COLUMN "quem_atualizou",
DROP COLUMN "quem_criou",
ADD COLUMN     "deletado_em" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CONDOMINIOS" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "endereco" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),
    "quem_criou" INTEGER,

    CONSTRAINT "CONDOMINIOS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FUNCIONARIOS" (
    "id" SERIAL NOT NULL,
    "cargo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),
    "quem_criou" INTEGER,
    "usuario_id" INTEGER NOT NULL,
    "condominio_id" INTEGER NOT NULL,

    CONSTRAINT "FUNCIONARIOS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CONDOMINIOS_cnpj_key" ON "CONDOMINIOS"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "FUNCIONARIOS_usuario_id_key" ON "FUNCIONARIOS"("usuario_id");

-- AddForeignKey
ALTER TABLE "UNIDADES" ADD CONSTRAINT "UNIDADES_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "CONDOMINIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FUNCIONARIOS" ADD CONSTRAINT "FUNCIONARIOS_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "USUARIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FUNCIONARIOS" ADD CONSTRAINT "FUNCIONARIOS_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "CONDOMINIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CHAVES_ACESSO" ADD CONSTRAINT "CHAVES_ACESSO_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "PERFIS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CHAVES_ACESSO" ADD CONSTRAINT "CHAVES_ACESSO_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "CONDOMINIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CHAVES_ACESSO" ADD CONSTRAINT "CHAVES_ACESSO_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "UNIDADES"("id") ON DELETE SET NULL ON UPDATE CASCADE;
