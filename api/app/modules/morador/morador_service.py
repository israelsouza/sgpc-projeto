from fastapi import HTTPException, status

from app.modules.chave.chave_service import ChaveService
from app.modules.core.core_exception import ValidationError
from app.modules.core.security import hash_senha
from app.modules.morador.morador_model import MoradorModel
from app.modules.morador.morador_schema import MoradorCreate
from app.modules.usuario.usuario_model import UsuarioModel
from prisma import Prisma


class MoradorService:
    @staticmethod
    async def registrar_morador(dados: MoradorCreate, db: Prisma):
        # 1. Validar Chave via ChaveService
        chave = await ChaveService.validar_e_consumir_chave(
            dados.chave_acesso, db, ["MORADOR"]
        )

        if not chave.unidade_id:
            raise ValidationError(
                nome="unidade_obrigatoria",
                mensagem="Esta chave de morador não possui uma unidade vinculada.",
                acao="Peça ao síndico para gerar uma chave vinculada a uma unidade.",
            )

        # 2. Verificar duplicidade via Models
        usuario_existente = await UsuarioModel.buscar_por_email(dados.email, db)
        if usuario_existente:
            raise ValidationError(
                nome="email_em_uso",
                mensagem="E-mail já cadastrado.",
                acao="Recupere sua senha.",
            )

        morador_existente = await MoradorModel.buscar_por_cpf(dados.cpf, db)
        if morador_existente:
            raise ValidationError(
                nome="cpf_em_uso",
                mensagem="CPF já cadastrado.",
                acao="Procure a administração.",
            )

        # 3. Transação
        try:
            async with db.tx() as transaction:
                # 3.1 Criar Usuário
                novo_usuario = await UsuarioModel.criar(
                    data={
                        "email": dados.email,
                        "senha": hash_senha(dados.senha),
                        "status": "ATIVO",
                        "perfis": {"connect": [{"id": chave.perfil_id}]},
                    },
                    db=transaction,
                )

                # 3.2 Criar Morador
                novo_morador = await MoradorModel.criar(
                    data={
                        "nome_completo": dados.nome_completo,
                        "celular": dados.celular,
                        "rg": dados.rg,
                        "cpf": dados.cpf,
                        "data_nascimento": dados.data_nascimento,
                        "status": "PENDENTE",
                        "usuario_id": novo_usuario.id,
                        "unidade_id": chave.unidade_id,
                    },
                    db=transaction,
                )

                # 3.3 Queimar Chave via transação
                await ChaveService.marcar_como_usada(chave.id, transaction)

                return novo_morador
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Erro no registro de morador: {str(e)}"
            )

    @staticmethod
    async def aprovar_morador(id_morador: int, db: Prisma):
        morador = await MoradorModel.buscar_por_id(id_morador, db)

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
            await MoradorModel.atualizar_status(id_morador, "ATIVO", db)
            return {"message": "Cadastro aprovado com sucesso."}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao aprovar cadastro: {str(e)}",
            )
