-- CreateTable
CREATE TABLE "documentos" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "categoria" VARCHAR(100) NOT NULL,
    "file_id" TEXT NOT NULL,
    "filename_orig" TEXT NOT NULL,
    "sha256_hash" TEXT NOT NULL,
    "condominio_id" INTEGER NOT NULL,
    "quem_criou_id" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos_logs" (
    "id" SERIAL NOT NULL,
    "documento_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "acao" VARCHAR(50) NOT NULL,
    "ip_address" VARCHAR(45),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documentos_file_id_key" ON "documentos"("file_id");

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "CONDOMINIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_quem_criou_id_fkey" FOREIGN KEY ("quem_criou_id") REFERENCES "USUARIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_logs" ADD CONSTRAINT "documentos_logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "USUARIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
