from app.modules.autenticacao.autenticacao_schema import LoginSchema
from app.modules.core.auth import create_access_token
from app.modules.core.core_exception import ValidationError
from app.modules.core.security import verificar_senha
from app.modules.usuario.usuario_model import UsuarioModel
from app.modules.core.logger import logger
from prisma import Prisma


class AutenticacaoService:
    @staticmethod
    async def login(dados: LoginSchema, db: Prisma):
        """
        Realiza o login do usuário, validando credenciais e gerando token JWT.
        """
        log = logger.bind(module="AUTENTICACAO", action="login", email=dados.email)
        
        usuario = await UsuarioModel.buscar_por_email(
            dados.email, db, includes={"perfis": True, "morador": True}
        )

        if not usuario or not verificar_senha(dados.senha, usuario.senha):
            log.warn("Tentativa de login com credenciais inválidas")
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

        log.info("Login realizado com sucesso", usuario_id=usuario.id, roles=roles)

        return {"access_token": access_token, "token_type": "bearer"}
