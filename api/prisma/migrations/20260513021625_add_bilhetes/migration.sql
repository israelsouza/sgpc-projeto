-- CreateTable
CREATE TABLE "BILHETES" (
    "id" SERIAL NOT NULL,
    "assunto" VARCHAR(120) NOT NULL,
    "mensagem" VARCHAR(320) NOT NULL,
    "categoria" TEXT NOT NULL DEFAULT 'bilhete',
    "autor" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora_criacao" TEXT NOT NULL,
    "unidade" TEXT,
    "bloco" TEXT,
    "andar" TEXT,
    "numero" TEXT,
    "prefixo" TEXT,
    "morador_id" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "BILHETES_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BILHETES" ADD CONSTRAINT "BILHETES_morador_id_fkey" FOREIGN KEY ("morador_id") REFERENCES "MORADORES"("id") ON DELETE SET NULL ON UPDATE CASCADE;
