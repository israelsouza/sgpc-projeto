import hashlib
import hmac
import random
import string
from datetime import UTC, datetime, timedelta

from app.config import settings
from app.modules.autenticacao.autenticacao_schema import (
    LoginSchema,
    RecuperarSenhaRequest,
    ResetarSenhaRequest,
    ValidarCodigoRequest,
)
from app.modules.autenticacao.email_service import enviar_email_recuperacao
from app.modules.core.auth import create_access_token
from app.modules.core.core_exception import ValidationError
from app.modules.core.logger import logger
from app.modules.core.security import hash_senha, verificar_senha
from app.modules.usuario.usuario_model import UsuarioModel
from prisma import Prisma


def hash_email_for_logging(email: str) -> str:
    """Hash email using SHA-256 for privacy-safe logging."""
    normalized = email.lower().strip()
    return hashlib.sha256(normalized.encode()).hexdigest()


def hmac_codigo(codigo: str) -> str:
    """Generate HMAC of reset code using server-side secret."""
    return hmac.new(
        settings.HMAC_SECRET_KEY.encode(),
        codigo.encode(),
        hashlib.sha256,
    ).hexdigest()


class AutenticacaoService:
    @staticmethod
    async def login(dados: LoginSchema, db: Prisma):
        """
        Realiza o login do usuário, validando credenciais e gerando token JWT.
        """
        log = logger.bind(module="AUTENTICACAO", action="login", email=dados.email)

        usuario = await UsuarioModel.buscar_por_email(
            dados.email,
            db,
            includes={"perfis": True, "morador": True, "funcionario": True},
        )

        if not usuario or not verificar_senha(dados.senha, usuario.senha):
            log.warn("Tentativa de login com credenciais inválidas")
            raise ValidationError(
                nome="login_invalido",
                mensagem="E-mail ou senha incorretos.",
                acao="Verifique os dados ou tente recuperar sua senha.",
            )

        # Validação de status de aprovação
        if usuario.morador and usuario.morador.status == "PENDENTE":
            log.warn("Tentativa de login de morador pendente")
            raise ValidationError(
                nome="cadastro_pendente",
                mensagem="Seu cadastro ainda está em análise pelo síndico.",
                acao="Aguarde a aprovação para acessar o sistema.",
            )

        if usuario.funcionario and usuario.funcionario.status == "PENDENTE":
            log.warn("Tentativa de login de funcionário pendente")
            raise ValidationError(
                nome="cadastro_pendente",
                mensagem="Seu cadastro de funcionário ainda está em análise.",
                acao="Aguarde a aprovação da administração para acessar o sistema.",
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

    @staticmethod
    async def solicitar_recuperacao(dados: RecuperarSenhaRequest, db: Prisma):
        """
        Inicia o processo de recuperação de senha, enviando código por e-mail.
        """
        log = logger.bind(
            module="AUTENTICACAO",
            action="solicitar_recuperacao",
            email_hash=hash_email_for_logging(dados.email),
        )

        usuario = await UsuarioModel.buscar_por_email(
            dados.email,
            db,
            includes={"morador": True, "funcionario": True},
        )

        # Por segurança, não informamos se o e-mail existe ou não
        if not usuario:
            log.info("Solicitação de recuperação para e-mail inexistente")
            return {"mensagem": "Se o e-mail existir na base, um código será enviado."}

        # Validação de status: Apenas ATIVOS podem recuperar senha
        vinc_ativo = False
        if usuario.morador and usuario.morador.status == "ATIVO":
            vinc_ativo = True
        elif usuario.funcionario and usuario.funcionario.status == "ATIVO":
            vinc_ativo = True

        if not vinc_ativo or usuario.status != "ATIVO":
            log.warn("Tentativa de recuperação para usuário não ativo/pendente")
            return {"mensagem": "Se o e-mail existir na base, um código será enviado."}

        # Invalida códigos anteriores
        await db.recuperacaosenha.update_many(
            where={"usuario_id": usuario.id, "usada": False}, data={"usada": True}
        )

        # Gera código de 6 dígitos
        codigo = "".join(random.choices(string.digits, k=6))
        expira_em = datetime.now(UTC) + timedelta(hours=2)

        # Salva no banco com HMAC do código
        codigo_hmac = hmac_codigo(codigo)
        await db.recuperacaosenha.create(
            data={
                "usuario_id": usuario.id,
                "codigo": codigo_hmac,
                "expira_em": expira_em,
            }
        )

        # Envia e-mail
        nome_exibicao = (
            usuario.morador.nome_completo
            if usuario.morador
            else usuario.funcionario.nome_completo
        )

        try:
            await enviar_email_recuperacao(usuario.email, nome_exibicao, codigo)
            log.info("E-mail de recuperação enviado com sucesso")
        except Exception as e:
            log.error("Falha ao enviar e-mail de recuperação", error=str(e))
            # Não falhamos a requisição para não dar pistas ao atacante,
            # mas o log registrará o erro interno.

        return {"mensagem": "Se o e-mail existir na base, um código será enviado."}

    @staticmethod
    async def validar_codigo(dados: ValidarCodigoRequest, db: Prisma):
        """
        Valida se o código enviado ainda é válido.
        """
        log = logger.bind(
            module="AUTENTICACAO",
            action="validar_codigo",
            email_hash=hash_email_for_logging(dados.email),
        )

        # Find all non-expired recovery codes for this email
        recuperacoes = await db.recuperacaosenha.find_many(
            where={
                "usuario": {"is": {"email": dados.email}},
                "usada": False,
                "expira_em": {"gt": datetime.now(UTC)},
            }
        )

        # Compare HMAC of provided code with stored HMACs
        codigo_hmac = hmac_codigo(dados.codigo)
        recuperacao = None
        for rec in recuperacoes:
            if hmac.compare_digest(rec.codigo, codigo_hmac):
                recuperacao = rec
                break

        if not recuperacao:
            log.warn("Código de recuperação inválido ou expirado")
            raise ValidationError(
                nome="codigo_invalido",
                mensagem="Código inválido, expirado ou já utilizado.",
                acao="Solicite um novo código de recuperação.",
            )

        log.info("Código validado com sucesso")
        return {"valido": True}

    @staticmethod
    async def resetar_senha(dados: ResetarSenhaRequest, db: Prisma):
        """
        Atualiza a senha do usuário após validação do código.
        """
        log = logger.bind(
            module="AUTENTICACAO",
            action="resetar_senha",
            email_hash=hash_email_for_logging(dados.email),
        )

        # Find all non-expired recovery codes for this email
        recuperacoes = await db.recuperacaosenha.find_many(
            where={
                "usuario": {"is": {"email": dados.email}},
                "usada": False,
                "expira_em": {"gt": datetime.now(UTC)},
            },
            include={"usuario": {"include": {"morador": True, "funcionario": True}}},
        )

        # Compare HMAC of provided code with stored HMACs
        codigo_hmac = hmac_codigo(dados.codigo)
        recuperacao = None
        for rec in recuperacoes:
            if hmac.compare_digest(rec.codigo, codigo_hmac):
                recuperacao = rec
                break

        if not recuperacao:
            log.warn("Tentativa de reset de senha com código inválido")
            raise ValidationError(
                nome="codigo_invalido",
                mensagem="Código inválido, expirado ou já utilizado.",
                acao="Solicite um novo código de recuperação.",
            )

        # Revalidação de Status no momento do Reset (Segurança Extra)
        usuario = recuperacao.usuario
        vinc_ativo = False
        if usuario.morador and usuario.morador.status == "ATIVO":
            vinc_ativo = True
        elif usuario.funcionario and usuario.funcionario.status == "ATIVO":
            vinc_ativo = True

        if not vinc_ativo or usuario.status != "ATIVO":
            log.error(
                "Tentativa de reset de senha para usuário não autorizado",
                usuario_id=usuario.id,
            )
            raise ValidationError(
                nome="usuario_bloqueado",
                mensagem="Sua conta não possui permissão para redefinir a senha.",
                acao="Entre em contato com a administração.",
            )

        # Atualiza senha do usuário e marca código como usado em transação
        nova_senha_hash = hash_senha(dados.nova_senha)

        async with db.tx() as transaction:
            # Update password
            await transaction.usuario.update(
                where={"id": recuperacao.usuario_id}, data={"senha": nova_senha_hash}
            )

            # Conditionally mark code as used (only if not already used)
            result = await transaction.recuperacaosenha.update_many(
                where={"id": recuperacao.id, "usada": False}, data={"usada": True}
            )

            # If count is 0, the code was already used (race condition)
            if result == 0:
                log.error(
                    "Tentativa de reutilizar código de recuperação",
                    usuario_id=recuperacao.usuario_id,
                )
                raise ValidationError(
                    nome="codigo_ja_usado",
                    mensagem="Este código já foi utilizado.",
                    acao="Solicite um novo código de recuperação.",
                )

        log.info("Senha resetada com sucesso", usuario_id=recuperacao.usuario_id)
        return {"mensagem": "Sua senha foi alterada com sucesso."}