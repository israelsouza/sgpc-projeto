import bcrypt
import jwt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from app.db.prisma_client import get_prisma
from app.modules.core.auth import ALGORITHM, SECRET_KEY
from app.modules.core.core_exception import ForbiddenError, UnauthorizedError
from app.modules.core.logger import logger
from prisma import Prisma

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


def hash_senha(senha: str) -> str:
    """Gera um hash seguro da senha."""
    salt = bcrypt.gensalt()
    # O hashpw retorna bytes, então decodificamos para string para salvar no banco
    hashed = bcrypt.hashpw(senha.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verificar_senha(senha_plana: str, senha_hash: str) -> bool:
    """Verifica se a senha plana coincide com o hash do banco."""
    return bcrypt.checkpw(senha_plana.encode("utf-8"), senha_hash.encode("utf-8"))


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Prisma = Depends(get_prisma)
):
    """
    Dependência para extrair o usuário atual do token JWT.
    Retorna o objeto Usuario com perfis e permissões carregados.
    """
    log = logger.bind(module="SECURITY", action="get_current_user")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id: str = payload.get("sub")
        if usuario_id is None:
            log.warn("Token JWT sem campo 'sub'")
            raise UnauthorizedError()
    except jwt.PyJWTError as e:
        log.warn("Falha ao decodificar token JWT", error=str(e))
        raise UnauthorizedError()

    usuario = await db.usuario.find_unique(
        where={"id": int(usuario_id)},
        include={
            "perfis": {"include": {"permissoes": True}},
            "funcionario": True,
            "morador": {"include": {"unidade": True}},
        },
    )

    if usuario is None:
        log.error("Usuário do token não encontrado no banco", usuario_id=usuario_id)
        raise UnauthorizedError(mensagem="Usuário não encontrado no sistema.")

    return usuario


class RequirePermission:
    """
    Dependência para validar se o usuário possui uma permissão específica.
    Uso: @router.get("/", dependencies=[Depends(RequirePermission("ler:usuario"))])
    """

    def __init__(self, permissao: str):
        self.permissao = permissao

    async def __call__(self, usuario=Depends(get_current_user)):
        log = logger.bind(
            module="SECURITY", 
            action="check_permission", 
            permissao_requerida=self.permissao,
            usuario_id=usuario.id
        )

        # 1. Bypass para ADMIN (Sistema)
        perfis_nomes = [p.nome for p in usuario.perfis]
        if "ADMIN" in perfis_nomes:
            return True

        # 2. Coletar todas as permissões do usuário
        permissoes_usuario = set()
        for perfil in usuario.perfis:
            for perm in perfil.permissoes:
                permissoes_usuario.add(perm.nome)

        # 3. Validar a permissão requerida
        if self.permissao not in permissoes_usuario:
            log.warn("Acesso negado por falta de permissão", roles=perfis_nomes)
            raise ForbiddenError(
                mensagem=f"Você não tem a permissão necessária: {self.permissao}"
            )

        return True


def validar_escopo_condominio(usuario, condominio_id_alvo: int):
    """
    Verifica se o usuário tem permissão para acessar o condomínio alvo.
    Levanta ForbiddenError se o escopo for inválido.
    """
    log = logger.bind(
        module="SECURITY", 
        action="validate_scope", 
        condominio_alvo=condominio_id_alvo,
        usuario_id=usuario.id
    )

    # 1. Verificar Condomínio via Funcionário
    if usuario.funcionario and usuario.funcionario.condominio_id == condominio_id_alvo:
        return True

    # 3. Verificar Condomínio via Morador (através da Unidade)
    if (
        usuario.morador
        and usuario.morador.unidade
        and usuario.morador.unidade.condominio_id == condominio_id_alvo
    ):
        return True

    # 4. Se chegou aqui, o usuário está tentando acessar um condomínio que não é dele
    log.error("Tentativa de acesso a condomínio fora de escopo")
    raise ForbiddenError(
        mensagem="Acesso negado: Este recurso não pertence ao seu condomínio.",
        acao="Certifique-se de que você está no contexto correto do seu condomínio.",
    )
