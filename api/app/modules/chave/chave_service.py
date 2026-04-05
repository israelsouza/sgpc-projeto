from datetime import UTC, datetime, timedelta

from app.modules.chave.chave_schema import ChaveAcessoCreate
from app.modules.core.core_exception import ValidationError
from app.modules.core.security import validar_escopo_condominio
from prisma import Prisma


class ChaveService:
    @staticmethod
    async def validar_e_consumir_chave(
        chave_str: str, db: Prisma, perfis_permitidos: list[str]
    ):
        """
        Valida a existência, uso, validade e perfil da chave. Marca como usada se válida.
        """
        chave_acesso = await db.chaveacesso.find_unique(
            where={"chave": chave_str}, include={"perfil": True}
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
                mensagem="Esta chave de acesso já foi utilizada.",
                acao="Solicite uma nova chave.",
            )

        if chave_acesso.validade < datetime.now(chave_acesso.validade.tzinfo):
            raise ValidationError(
                nome="chave_expirada",
                mensagem="Esta chave de acesso expirou.",
                acao="Peça ao síndico para gerar uma nova chave.",
            )

        if chave_acesso.perfil.nome not in perfis_permitidos:
            raise ValidationError(
                nome="perfil_invalido",
                mensagem=f"Esta chave é para o perfil {chave_acesso.perfil.nome} e não pode ser usada aqui.",
                acao="Use o endpoint correto para seu tipo de perfil.",
            )

        return chave_acesso

    @staticmethod
    async def gerar_chave_acesso(
        dados: ChaveAcessoCreate, db: Prisma, usuario_atual_id: int
    ):
        """
        Gera uma nova chave UUID no banco com validações de hierarquia e escopo.
        """
        # 1. Buscar dados do criador
        usuario_criador = await db.usuario.find_unique(
            where={"id": usuario_atual_id},
            include={
                "perfis": True,
                "funcionario": True,
                "morador": {"include": {"unidade": True}},
            },
        )

        if not usuario_criador:
            raise ValidationError(
                nome="usuario_nao_localizado",
                mensagem="Usuário criador não encontrado.",
                acao="Verifique sua autenticação.",
            )

        # 2. Validar Escopo (Multi-tenancy) via utilitário centralizado
        validar_escopo_condominio(usuario_criador, dados.condominio_id)

        # 3. Travas de Regra de Negócio (Hierarquia de Perfis)
        perfis_criador = [p.nome for p in usuario_criador.perfis]
        if "SINDICO" in perfis_criador and "ADMIN" not in perfis_criador:
            # Hierarquia: Não gera para ADMIN ou outro SINDICO
            perfil_alvo = await db.perfil.find_unique(where={"id": dados.perfil_id})
            if not perfil_alvo or perfil_alvo.nome in ["ADMIN", "SINDICO"]:
                raise ValidationError(
                    nome="permissao_negada",
                    mensagem="Você não tem permissão para gerar chaves para perfis administrativos.",
                    acao="Contate o suporte se precisar de mais privilégios.",
                )

        # 4. Gerar a Chave
        validade = datetime.now(UTC) + timedelta(hours=dados.validade_em_horas)

        nova_chave = await db.chaveacesso.create(
            data={
                "validade": validade,
                "perfil_id": dados.perfil_id,
                "condominio_id": dados.condominio_id,
                "unidade_id": dados.unidade_id,
                "quem_criou": usuario_atual_id,
            }
        )

        return {
            "chave": nova_chave.chave,
            "validade": nova_chave.validade,
        }

    @staticmethod
    async def marcar_como_usada(chave_id: str, transaction: Prisma):
        # Marca uma chave como utilizada dentro de uma transação.
        await transaction.chaveacesso.update(
            where={"id": chave_id}, data={"usada": True}
        )
