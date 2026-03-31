from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status

from app.modules.core.auth import create_access_token
from app.modules.core.core_exception import ValidationError
from app.modules.core.security import hash_senha, verificar_senha
from app.modules.usuario.usuario_schema import (
    ChaveAcessoCreate,
    LoginSchema,
    MoradorCreate,
)
from prisma import Prisma


class UsuarioService:
    @staticmethod
    async def registrar_morador(dados: MoradorCreate, db: Prisma):
        # 1. Validar Chave de Acesso
        chave_acesso = await db.chaveacesso.find_unique(
            where={"chave": dados.chave_acesso},
            include={"perfil": True}
        )

        if not chave_acesso:
            raise ValidationError(
                nome="chave_invalida",
                mensagem="A chave de acesso fornecida não existe.",
                acao="Solicite uma nova chave ao seu síndico.",
            )

        if chave_acesso.usada:
            raise ValidationError(
                nome="chave_usada",
                mensagem="Esta chave de acesso já foi utilizada para um cadastro.",
                acao="Se você já se cadastrou, tente fazer login. Caso contrário, peça uma nova chave.",
            )

        if chave_acesso.validade < datetime.now(chave_acesso.validade.tzinfo):
            raise ValidationError(
                nome="chave_expirada",
                mensagem="Esta chave de acesso expirou.",
                acao="Peça ao síndico para gerar uma nova chave de acesso.",
            )

        # 2. Verificar se o e-mail ou CPF já estão em uso
        usuario_existente = await db.usuario.find_unique(where={"email": dados.email})
        if usuario_existente:
            raise ValidationError(
                nome="email_em_uso",
                mensagem="Este e-mail já está cadastrado no sistema.",
                acao="Tente recuperar sua senha ou use outro e-mail.",
            )

        morador_existente = await db.morador.find_unique(where={"cpf": dados.cpf})
        if morador_existente:
            raise ValidationError(
                nome="cpf_em_uso",
                mensagem="Este CPF já está cadastrado no sistema.",
                acao="Caso não reconheça este cadastro, procure a administração do condomínio.",
            )

        # 3. Criar Transação
        try:
            async with db.tx() as transaction:
                # 3.1 Criar o Usuário com o Perfil da Chave
                novo_usuario = await transaction.usuario.create(
                    data={
                        "email": dados.email,
                        "senha": hash_senha(dados.senha),
                        "status": "ATIVO",
                        "perfis": {"connect": [{"id": chave_acesso.perfil_id}]}
                    }
                )

                # 3.2 Criar o Morador (vinculado à unidade da chave se houver)
                morador_data = {
                    "nome_completo": dados.nome_completo,
                    "celular": dados.celular,
                    "rg": dados.rg,
                    "cpf": dados.cpf,
                    "data_nascimento": dados.data_nascimento,
                    "status": "PENDENTE",
                    "usuario_id": novo_usuario.id,
                }

                if chave_acesso.unidade_id:
                    morador_data["unidade_id"] = chave_acesso.unidade_id

                novo_morador = await transaction.morador.create(data=morador_data)

                # 3.3 Se for perfil de funcionário (SINDICO, PORTEIRO, ADMIN), cria o vínculo
                if chave_acesso.perfil.nome in ["SINDICO", "PORTEIRO", "ADMIN"]:
                    await transaction.funcionario.create(
                        data={
                            "usuario_id": novo_usuario.id,
                            "condominio_id": chave_acesso.condominio_id,
                            "cargo": chave_acesso.perfil.nome,
                            "status": "ATIVO"
                        }
                    )

                # 3.4 Marcar a chave como usada
                await transaction.chaveacesso.update(
                    where={"id": chave_acesso.id}, data={"usada": True}
                )

                return novo_morador
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao processar o cadastro: {str(e)}",
            )

    @staticmethod
    async def login(dados: LoginSchema, db: Prisma):
        usuario = await db.usuario.find_unique(
            where={"email": dados.email}, include={"perfis": True, "morador": True}
        )

        if not usuario or not verificar_senha(dados.senha, usuario.senha):
            raise ValidationError(
                nome="login_invalido",
                mensagem="E-mail ou senha incorretos.",
                acao="Verifique os dados ou tente recuperar sua senha.",
            )

        roles = [p.nome for p in usuario.perfis]
        status_morador = usuario.morador.status if usuario.morador else "N/A"

        access_token = create_access_token(
            data={
                "sub": str(usuario.id),
                "email": usuario.email,
                "roles": roles,
                "morador_status": status_morador,
            }
        )

        return {"access_token": access_token, "token_type": "bearer"}

    @staticmethod
    async def gerar_chave_acesso(dados: ChaveAcessoCreate, db: Prisma, usuario_criador_id: int | None = None):
        validade = datetime.now(UTC) + timedelta(hours=dados.validade_em_horas)

        nova_chave = await db.chaveacesso.create(
            data={
                "validade": validade,
                "usada": False,
                "perfil_id": dados.perfil_id,
                "condominio_id": dados.condominio_id,
                "unidade_id": dados.unidade_id,
                "quem_criou": usuario_criador_id
            }
        )

        return {
            "chave": nova_chave.chave,
            "validade": nova_chave.validade,
            "mensagem": "Chave gerada com sucesso. Compartilhe o UUID acima com o usuário.",
        }

    @staticmethod
    async def aprovar_morador(id_morador: int, db: Prisma):
        morador = await db.morador.find_unique(
            where={"id": id_morador}
        )

        if not morador:
            raise ValidationError(
                nome="morador_nao_encontrado",
                mensagem="Morador não localizado.",
                acao="Verifique se o ID está correto.",
            )

        if morador.status != "PENDENTE":
            raise ValidationError(
                nome="morador_ja_processado",
                mensagem=f"Este morador já está com status {morador.status}.",
                acao="Não é possível aprovar um cadastro que não esteja pendente.",
            )

        try:
            await db.morador.update(
                where={"id": id_morador}, data={"status": "ATIVO"}
            )
            return {"message": "Cadastro aprovado com sucesso."}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao aprovar cadastro: {str(e)}",
            )
