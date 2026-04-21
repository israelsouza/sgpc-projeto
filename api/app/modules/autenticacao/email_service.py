from pathlib import Path

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from app.config import settings


def _get_connection_config():
    return ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_STARTTLS=settings.MAIL_STARTTLS,
        MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
        MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
        TEMPLATE_FOLDER=Path(__file__).parent.parent.parent / "templates",
    )


async def enviar_email_recuperacao(email_destino: str, nome_usuario: str, codigo: str):
    message = MessageSchema(
        subject="Recuperação de Senha - SGPC",
        recipients=[email_destino],
        template_body={"nome": nome_usuario, "codigo": codigo},
        subtype=MessageType.html,
    )

    conf = _get_connection_config()
    fm = FastMail(conf)
    await fm.send_message(message, template_name="recuperar_senha.html")
