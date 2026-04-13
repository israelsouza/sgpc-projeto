from fastapi import HTTPException

from app.modules.chave.chave_service import ChaveService
from app.modules.core.core_exception import ValidationError
from app.modules.core.security import hash_senha
from app.modules.funcionario.funcionario_model import FuncionarioModel
from app.modules.funcionario.funcionario_schema import FuncionarioRegistroCreate
from app.modules.usuario.usuario_model import UsuarioModel
from prisma import Prisma


class FuncionarioService:
    @staticmethod
    async def registrar_funcionario(dados: FuncionarioRegistroCreate, db: Prisma):
        # 1. Validar Chave via ChaveService
        chave = await ChaveService.validar_e_consumir_chave(
            dados.chave_acesso, db, ["SINDICO", "PORTEIRO", "ADMIN"]
        )

        # 2. Verificar duplicidade via Models
        usuario_existente = await UsuarioModel.buscar_por_email(dados.email, db)
        if usuario_existente:
            raise ValidationError(
                nome="email_em_uso",
                mensagem="E-mail já cadastrado.",
                acao="Recupere sua senha.",
            )

        funcionario_existente = await FuncionarioModel.buscar_por_cpf(dados.cpf, db)
        if funcionario_existente:
            raise ValidationError(
                nome="cpf_em_uso",
                mensagem="Este CPF já está cadastrado para um funcionário.",
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

                # 3.2 Criar Funcionário com seus próprios dados
                novo_funcionario = await FuncionarioModel.criar(
                    data={
                        "nome_completo": dados.nome_completo,
                        "celular": dados.celular,
                        "rg": dados.rg,
                        "cpf": dados.cpf,
                        "data_nascimento": dados.data_nascimento,
                        "cargo": chave.perfil.nome,
                        "status": "PENDENTE",
                        "usuario_id": novo_usuario.id,
                        "condominio_id": chave.condominio_id,
                    },
                    db=transaction,
                )

                # 3.3 Queimar Chave via transação
                await ChaveService.marcar_como_usada(chave.id, transaction)

                return novo_funcionario
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Erro no registro de funcionário: {str(e)}"
            )

    @staticmethod
    async def aprovar_funcionario(id_funcionario: int, db: Prisma):
        """
        Aprova um funcionário pendente no sistema.
        """
        funcionario = await FuncionarioModel.buscar_por_id(id_funcionario, db)

        if not funcionario:
            raise ValidationError(
                nome="funcionario_nao_encontrado",
                mensagem="Funcionário não localizado.",
                acao="Verifique se o ID está correto.",
            )

        if funcionario.status != "PENDENTE":
            raise ValidationError(
                nome="funcionario_ja_processado",
                mensagem=f"Este funcionário já está com status {funcionario.status}.",
                acao="Não é possível aprovar um cadastro que não esteja pendente.",
            )

        try:
            await FuncionarioModel.atualizar_status(id_funcionario, "ATIVO", db)
            return {"message": "Cadastro de funcionário aprovado com sucesso."}
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao aprovar funcionário: {str(e)}",
            )
