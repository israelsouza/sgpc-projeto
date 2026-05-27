/*
  Warnings:

  - The primary key for the `_PerfilToPermissao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_PerfilToUsuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_PerfilToPermissao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_PerfilToUsuario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StatusManifestacao" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'AGUARDANDO', 'CONCLUIDO', 'ENCERRADO');

-- AlterTable
ALTER TABLE "_PerfilToPermissao" DROP CONSTRAINT "_PerfilToPermissao_AB_pkey";

-- AlterTable
ALTER TABLE "_PerfilToUsuario" DROP CONSTRAINT "_PerfilToUsuario_AB_pkey";

-- CreateTable
CREATE TABLE "MANIFESTACOES" (
    "id" SERIAL NOT NULL,
    "assunto" VARCHAR(120) NOT NULL,
    "mensagem" VARCHAR(320) NOT NULL,
    "categoria" TEXT NOT NULL DEFAULT 'solicitacao',
    "status" "StatusManifestacao" NOT NULL DEFAULT 'PENDENTE',
    "autor" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora_criacao" TEXT NOT NULL,
    "unidade" TEXT,
    "bloco" TEXT,
    "andar" INTEGER,
    "numero" TEXT,
    "prefixo" TEXT,
    "TipoCondominio" "TipoCondominio",
    "morador_id" INTEGER,
    "unidade_id" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "MANIFESTACOES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MANIFESTACAO_MOVIMENTACOES" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "comentario" TEXT,
    "status" "StatusManifestacao" NOT NULL,
    "autor_role" TEXT,
    "data_movimentacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "manifestacao_id" INTEGER NOT NULL,

    CONSTRAINT "MANIFESTACAO_MOVIMENTACOES_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "_PerfilToPermissao_AB_unique" ON "_PerfilToPermissao"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_PerfilToUsuario_AB_unique" ON "_PerfilToUsuario"("A", "B");

-- AddForeignKey
ALTER TABLE "MANIFESTACOES" ADD CONSTRAINT "MANIFESTACOES_morador_id_fkey" FOREIGN KEY ("morador_id") REFERENCES "MORADORES"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MANIFESTACOES" ADD CONSTRAINT "MANIFESTACOES_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "UNIDADES"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MANIFESTACAO_MOVIMENTACOES" ADD CONSTRAINT "MANIFESTACAO_MOVIMENTACOES_manifestacao_id_fkey" FOREIGN KEY ("manifestacao_id") REFERENCES "MANIFESTACOES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
