import secrets
import string
from datetime import UTC, datetime, timedelta

from fastapi import BackgroundTasks

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
from app.modules.core.security import (
    gerar_hmac_codigo,
    hash_senha,
    verificar_hmac_codigo,
    verificar_senha,
)
from app.modules.usuario.usuario_model import UsuarioModel
from prisma import Prisma


class AutenticacaoService:
    @staticmethod
    async def login(dados: LoginSchema, db: Prisma):
        """
        Realiza o login do usuário, validando credenciais e gerando token JWT.
        """
        log = logger.bind(module="AUTENTICACAO", action="login", email="<redacted>")

        usuario = await UsuarioModel.buscar_por_email(
            dados.email,
            db,
            includes={
                "perfis": True,
                "morador": {"include": {"unidade": {"include": {"condominio": True}}}},
                "funcionario": {"include": {"condominio": True}},
            },
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

        # Extração de dados de perfil para o app mobile
        nome_exibicao = "Usuário"
        condominio_nome = "Condomínio"
        condominio_id = 0
        unidade_nome = ""

        if usuario.morador:
            nome_exibicao = usuario.morador.nome_completo
            if usuario.morador.unidade:
                bloco = (
                    f"Bloco {usuario.morador.unidade.bloco} - "
                    if usuario.morador.unidade.bloco
                    else ""
                )
                unidade_nome = f"{bloco}Unid. {usuario.morador.unidade.unidade}"
                if usuario.morador.unidade.condominio:
                    condominio_nome = usuario.morador.unidade.condominio.nome
                    condominio_id = usuario.morador.unidade.condominio.id
        elif usuario.funcionario:
            nome_exibicao = usuario.funcionario.nome_completo
            if usuario.funcionario.condominio:
                condominio_nome = usuario.funcionario.condominio.nome
                condominio_id = usuario.funcionario.condominio.id

        access_token = create_access_token(
            data={
                "sub": str(usuario.id),
                "email": usuario.email,
                "roles": roles,
                "morador_status": status_morador,
            }
        )

        log.info("Login realizado com sucesso", usuario_id=usuario.id, roles=roles)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "perfil": roles[0] if roles else "N/A",
            "nome": nome_exibicao,
            "condominio": condominio_nome,
            "condominio_id": condominio_id,
            "unidade": unidade_nome,
        }

    @staticmethod
    async def solicitar_recuperacao(
        dados: RecuperarSenhaRequest, background_tasks: BackgroundTasks, db: Prisma
    ):
        """
        Inicia o processo de recuperação de senha, enviando código por e-mail.
        """
        log = logger.bind(
            module="AUTENTICACAO", action="solicitar_recuperacao", email="<redacted>"
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

        log = log.bind(usuario_id=usuario.id)

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
        codigo = "".join(secrets.choice(string.digits) for _ in range(6))
        codigo_hmac = gerar_hmac_codigo(codigo)
        expira_em = datetime.now(UTC) + timedelta(hours=2)

        # Salva no banco o HMAC
        await db.recuperacaosenha.create(
            data={
                "usuario_id": usuario.id,
                "codigo": codigo_hmac,
                "expira_em": expira_em,
            }
        )

        # Envia e-mail com o código limpo (em background)
        nome_exibicao = (
            usuario.morador.nome_completo
            if usuario.morador
            else usuario.funcionario.nome_completo
        )

        async def _enviar_email_bg():
            try:
                await enviar_email_recuperacao(usuario.email, nome_exibicao, codigo)
                log.info("E-mail de recuperação enviado com sucesso")
            except Exception as e:
                log.error("Falha ao enviar e-mail de recuperação", error=str(e))

        background_tasks.add_task(_enviar_email_bg)

        return {"mensagem": "Se o e-mail existir na base, um código será enviado."}

    @staticmethod
    async def validar_codigo(dados: ValidarCodigoRequest, db: Prisma):
        """
        Valida se o código enviado ainda é válido.
        """
        log = logger.bind(
            module="AUTENTICACAO", action="validar_codigo", email="<redacted>"
        )

        recuperacoes = await db.recuperacaosenha.find_many(
            where={
                "usuario": {"is": {"email": dados.email}},
                "usada": False,
                "expira_em": {"gt": datetime.now(UTC)},
            }
        )

        recuperacao = None
        for r in recuperacoes:
            if verificar_hmac_codigo(dados.codigo, r.codigo):
                recuperacao = r
                break

        if not recuperacao:
            log.warn("Código de recuperação inválido ou expirado")
            raise ValidationError(
                nome="codigo_invalido",
                mensagem="Código inválido, expirado ou já utilizado.",
                acao="Solicite um novo código de recuperação.",
            )

        log.info("Código validado com sucesso", usuario_id=recuperacao.usuario_id)
        return {"valido": True}

    @staticmethod
    async def resetar_senha(dados: ResetarSenhaRequest, db: Prisma):
        """
        Atualiza a senha do usuário após validação do código.
        """
        log = logger.bind(
            module="AUTENTICACAO", action="resetar_senha", email="<redacted>"
        )

        recuperacoes = await db.recuperacaosenha.find_many(
            where={
                "usuario": {"is": {"email": dados.email}},
                "usada": False,
                "expira_em": {"gt": datetime.now(UTC)},
            },
            include={"usuario": {"include": {"morador": True, "funcionario": True}}},
        )

        recuperacao = None
        for r in recuperacoes:
            if verificar_hmac_codigo(dados.codigo, r.codigo):
                recuperacao = r
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

        nova_senha_hash = hash_senha(dados.nova_senha)

        # Transação para garantir consistência
        async with db.tx() as transaction:
            updated_recuperacao = await transaction.recuperacaosenha.update_many(
                where={"id": recuperacao.id, "usada": False}, data={"usada": True}
            )

            if updated_recuperacao == 0:
                log.warn(
                    "Tentativa de reset simultâneo ou código já usado",
                    usuario_id=usuario.id,
                )
                raise ValidationError(
                    nome="codigo_invalido",
                    mensagem="Código inválido, expirado ou já utilizado.",
                    acao="Solicite um novo código de recuperação.",
                )

            await transaction.usuario.update(
                where={"id": recuperacao.usuario_id}, data={"senha": nova_senha_hash}
            )

        log.info("Senha resetada com sucesso", usuario_id=recuperacao.usuario_id)
        return {"mensagem": "Sua senha foi alterada com sucesso."}
