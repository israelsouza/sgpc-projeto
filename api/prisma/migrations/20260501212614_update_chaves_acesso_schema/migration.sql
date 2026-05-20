/*
  Warnings:

  - Added the required column `atualizado_em` to the `CHAVES_ACESSO` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoriaAviso" AS ENUM ('MANUTENCAO', 'ASSEMBLEIA', 'URGENTE', 'GERAL');

-- AlterTable
ALTER TABLE "CHAVES_ACESSO" ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "AVISOS" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" "CategoriaAviso" NOT NULL,
    "anexo_url" TEXT,
    "condominio_id" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),
    "quem_criou" INTEGER,

    CONSTRAINT "AVISOS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FCM_TOKENS" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "dispositivo" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FCM_TOKENS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FCM_TOKENS_token_key" ON "FCM_TOKENS"("token");

-- AddForeignKey
ALTER TABLE "AVISOS" ADD CONSTRAINT "AVISOS_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "CONDOMINIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FCM_TOKENS" ADD CONSTRAINT "FCM_TOKENS_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "USUARIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
