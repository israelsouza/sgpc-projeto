from app.modules.core.core_exception import ValidationError
from app.modules.usuario.usuario_schema import (
    ChaveAcessoCreate,
    LoginSchema,
    MoradorCreate,
)
from app.modules.usuario.usuario_service import UsuarioService
from prisma import Prisma


class UsuarioController:
    @staticmethod
    async def registrar_morador(dados: MoradorCreate, db: Prisma):
        return await UsuarioService.registrar_morador(dados, db)

    @staticmethod
    async def login(dados: LoginSchema, db: Prisma):
        return await UsuarioService.login(dados, db)

    @staticmethod
    async def gerar_chave_acesso(
        dados: ChaveAcessoCreate, db: Prisma, usuario_atual_id: int
    ):
        """
        Gera uma chave de acesso com validações de hierarquia.
        ADMIN: Pode gerar para qualquer condomínio e qualquer perfil.
        SINDICO: Só pode gerar para o seu condomínio e perfis operacionais (MORADOR, PORTEIRO, etc).
        """

        # 1. Buscar dados do usuário que está criando a chave
        usuario_criador = await db.usuario.find_unique(
            where={"id": usuario_atual_id},
            include={"perfis": True, "funcionario": True},
        )

        if not usuario_criador:
            raise ValidationError(
                nome="usuario_nao_encontrado",
                mensagem="Usuário criador não localizado.",
                acao="Verifique se você está logado corretamente.",
            )

        perfis_criador = [p.nome for p in usuario_criador.perfis]

        # 2. Se for SINDICO, aplicar as travas
        if "SINDICO" in perfis_criador and "ADMIN" not in perfis_criador:
            # Trava de Condomínio: Deve ser o mesmo onde trabalha
            if (
                not usuario_criador.funcionario
                or usuario_criador.funcionario.condominio_id != dados.condominio_id
            ):
                raise ValidationError(
                    nome="permissao_negada",
                    mensagem="Você só pode gerar chaves para o condomínio onde atua como síndico.",
                    acao="Verifique o condomínio selecionado.",
                )

            # Trava de Perfil: Não pode gerar chave para ADMIN ou outro SINDICO
            perfil_alvo = await db.perfil.find_unique(where={"id": dados.perfil_id})
            if not perfil_alvo or perfil_alvo.nome in ["ADMIN", "SINDICO"]:
                raise ValidationError(
                    nome="permissao_negada",
                    mensagem="Você não tem permissão para gerar chaves para perfis administrativos.",
                    acao="Contate o administrador do sistema se precisar de mais privilégios.",
                )

        # 3. Chamar o Service
        return await UsuarioService.gerar_chave_acesso(dados, db, usuario_atual_id)

    @staticmethod
    async def aprovar_morador(id_morador: int, db: Prisma):
        return await UsuarioService.aprovar_morador(id_morador, db)
