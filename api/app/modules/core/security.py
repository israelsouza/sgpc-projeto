import bcrypt
import jwt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from app.db.prisma_client import get_prisma
from app.modules.core.auth import ALGORITHM, SECRET_KEY
from app.modules.core.core_exception import ForbiddenError, UnauthorizedError
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
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id: str = payload.get("sub")
        if usuario_id is None:
            raise UnauthorizedError()
    except jwt.PyJWTError:
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
            raise ForbiddenError(
                mensagem=f"Você não tem a permissão necessária: {self.permissao}"
            )

        return True
