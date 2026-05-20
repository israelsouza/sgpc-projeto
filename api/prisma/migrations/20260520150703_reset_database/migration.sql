-- CreateEnum
CREATE TYPE "TipoCondominio" AS ENUM ('PREDIO', 'HORIZONTAL');

-- CreateEnum
CREATE TYPE "CategoriaAviso" AS ENUM ('MANUTENCAO', 'ASSEMBLEIA', 'URGENTE', 'GERAL');

-- CreateTable
CREATE TABLE "CONDOMINIOS" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoCond" "TipoCondominio" NOT NULL DEFAULT 'PREDIO',
    "cnpj" TEXT,
    "endereco" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),
    "quem_criou" INTEGER,

    CONSTRAINT "CONDOMINIOS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UNIDADES" (
    "id" SERIAL NOT NULL,
    "unidade" TEXT NOT NULL,
    "bloco" TEXT,
    "andar" INTEGER,
    "condominio_id" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),
    "quem_criou" INTEGER,

    CONSTRAINT "UNIDADES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PERFIS" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "PERFIS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PERMISSOES" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "PERMISSOES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USUARIOS" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "USUARIOS_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "FCM_TOKENS" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "dispositivo" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FCM_TOKENS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RECUPERACOES_SENHA" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "expira_em" TIMESTAMP(3) NOT NULL,
    "usada" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RECUPERACOES_SENHA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CONVITES" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "morador_id" INTEGER NOT NULL,
    "data_expiracao" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CONVITES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VISITANTES" (
    "id" SERIAL NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "morador_id" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VISITANTES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MORADORES" (
    "id" SERIAL NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "rg" TEXT,
    "cpf" TEXT NOT NULL,
    "data_nascimento" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),
    "quem_criou" INTEGER,
    "usuario_id" INTEGER,
    "unidade_id" INTEGER,

    CONSTRAINT "MORADORES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FUNCIONARIOS" (
    "id" SERIAL NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "data_nascimento" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "CHAVES_ACESSO" (
    "id" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "validade" TIMESTAMP(3) NOT NULL,
    "usada" BOOLEAN NOT NULL DEFAULT false,
    "perfil_id" INTEGER NOT NULL,
    "condominio_id" INTEGER NOT NULL,
    "unidade_id" INTEGER,
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

-- CreateTable
CREATE TABLE "_PerfilToPermissao" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CONDOMINIOS_cnpj_key" ON "CONDOMINIOS"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "UNIDADES_unidade_key" ON "UNIDADES"("unidade");

-- CreateIndex
CREATE UNIQUE INDEX "PERFIS_nome_key" ON "PERFIS"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "PERMISSOES_nome_key" ON "PERMISSOES"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "USUARIOS_email_key" ON "USUARIOS"("email");

-- CreateIndex
CREATE UNIQUE INDEX "documentos_file_id_key" ON "documentos"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "FCM_TOKENS_token_key" ON "FCM_TOKENS"("token");

-- CreateIndex
CREATE UNIQUE INDEX "CONVITES_token_key" ON "CONVITES"("token");

-- CreateIndex
CREATE UNIQUE INDEX "MORADORES_celular_key" ON "MORADORES"("celular");

-- CreateIndex
CREATE UNIQUE INDEX "MORADORES_cpf_key" ON "MORADORES"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "MORADORES_usuario_id_key" ON "MORADORES"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "FUNCIONARIOS_celular_key" ON "FUNCIONARIOS"("celular");

-- CreateIndex
CREATE UNIQUE INDEX "FUNCIONARIOS_cpf_key" ON "FUNCIONARIOS"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "FUNCIONARIOS_usuario_id_key" ON "FUNCIONARIOS"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "CHAVES_ACESSO_chave_key" ON "CHAVES_ACESSO"("chave");

-- CreateIndex
CREATE UNIQUE INDEX "_PerfilToUsuario_AB_unique" ON "_PerfilToUsuario"("A", "B");

-- CreateIndex
CREATE INDEX "_PerfilToUsuario_B_index" ON "_PerfilToUsuario"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PerfilToPermissao_AB_unique" ON "_PerfilToPermissao"("A", "B");

-- CreateIndex
CREATE INDEX "_PerfilToPermissao_B_index" ON "_PerfilToPermissao"("B");

-- AddForeignKey
ALTER TABLE "UNIDADES" ADD CONSTRAINT "UNIDADES_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "CONDOMINIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AVISOS" ADD CONSTRAINT "AVISOS_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "CONDOMINIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "CONDOMINIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_quem_criou_id_fkey" FOREIGN KEY ("quem_criou_id") REFERENCES "USUARIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_logs" ADD CONSTRAINT "documentos_logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "USUARIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FCM_TOKENS" ADD CONSTRAINT "FCM_TOKENS_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "USUARIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RECUPERACOES_SENHA" ADD CONSTRAINT "RECUPERACOES_SENHA_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "USUARIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CONVITES" ADD CONSTRAINT "CONVITES_morador_id_fkey" FOREIGN KEY ("morador_id") REFERENCES "MORADORES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VISITANTES" ADD CONSTRAINT "VISITANTES_morador_id_fkey" FOREIGN KEY ("morador_id") REFERENCES "MORADORES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MORADORES" ADD CONSTRAINT "MORADORES_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "USUARIOS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MORADORES" ADD CONSTRAINT "MORADORES_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "UNIDADES"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_PerfilToUsuario" ADD CONSTRAINT "_PerfilToUsuario_A_fkey" FOREIGN KEY ("A") REFERENCES "PERFIS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PerfilToUsuario" ADD CONSTRAINT "_PerfilToUsuario_B_fkey" FOREIGN KEY ("B") REFERENCES "USUARIOS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PerfilToPermissao" ADD CONSTRAINT "_PerfilToPermissao_A_fkey" FOREIGN KEY ("A") REFERENCES "PERFIS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PerfilToPermissao" ADD CONSTRAINT "_PerfilToPermissao_B_fkey" FOREIGN KEY ("B") REFERENCES "PERMISSOES"("id") ON DELETE CASCADE ON UPDATE CASCADE;
