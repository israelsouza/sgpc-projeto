-- CreateEnum
CREATE TYPE "StatusEntrega" AS ENUM ('AGUARDANDO', 'RECEBIDA', 'RETIRADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "CategoriaEntrega" AS ENUM ('CARTA', 'PACOTE');

-- CreateTable
CREATE TABLE "ENTREGAS" (
    "id" SERIAL NOT NULL,
    "morador_id" INTEGER NOT NULL,
    "tipo" "CategoriaEntrega" NOT NULL,
    "status" "StatusEntrega" NOT NULL DEFAULT 'AGUARDANDO',
    "prazo_retirada" TIMESTAMP(3) NOT NULL,
    "mensagem" TEXT,
    "justificativa_cancelamento" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),
    "quem_criou" INTEGER,

    CONSTRAINT "ENTREGAS_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ENTREGAS" ADD CONSTRAINT "ENTREGAS_morador_id_fkey" FOREIGN KEY ("morador_id") REFERENCES "MORADORES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
