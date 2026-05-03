-- CreateTable
CREATE TABLE "UNIDADES" (
    "id" SERIAL NOT NULL,
    "unidade" TEXT NOT NULL,
    "bloco" TEXT,
    "andar" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "quem_criou" INTEGER,
    "quem_atualizou" INTEGER,

    CONSTRAINT "UNIDADES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PERFIS" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "PERFIS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USUARIOS" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "quem_criou" INTEGER,
    "quem_atualizou" INTEGER,

    CONSTRAINT "USUARIOS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MORADORES" (
    "id" SERIAL NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "rg" TEXT,
    "cpf" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "quem_criou" INTEGER,
    "quem_atualizou" INTEGER,
    "usuario_id" INTEGER,
    "unidade_id" INTEGER,

    CONSTRAINT "MORADORES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CHAVES_ACESSO" (
    "id" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "validade" TIMESTAMP(3) NOT NULL,
    "usada" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "quem_criou" INTEGER,

    CONSTRAINT "CHAVES_ACESSO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PerfilToUsuario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PERFIS_nome_key" ON "PERFIS"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "USUARIOS_email_key" ON "USUARIOS"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MORADORES_cpf_key" ON "MORADORES"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "MORADORES_usuario_id_key" ON "MORADORES"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "CHAVES_ACESSO_chave_key" ON "CHAVES_ACESSO"("chave");

-- CreateIndex
CREATE UNIQUE INDEX "_PerfilToUsuario_AB_unique" ON "_PerfilToUsuario"("A", "B");

-- CreateIndex
CREATE INDEX "_PerfilToUsuario_B_index" ON "_PerfilToUsuario"("B");

-- AddForeignKey
ALTER TABLE "MORADORES" ADD CONSTRAINT "MORADORES_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "USUARIOS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MORADORES" ADD CONSTRAINT "MORADORES_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "UNIDADES"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PerfilToUsuario" ADD CONSTRAINT "_PerfilToUsuario_A_fkey" FOREIGN KEY ("A") REFERENCES "PERFIS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PerfilToUsuario" ADD CONSTRAINT "_PerfilToUsuario_B_fkey" FOREIGN KEY ("B") REFERENCES "USUARIOS"("id") ON DELETE CASCADE ON UPDATE CASCADE;
