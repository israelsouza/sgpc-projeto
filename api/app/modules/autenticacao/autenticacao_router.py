from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.db.prisma_client import get_prisma
from app.modules.autenticacao.autenticacao_controller import AutenticacaoController
from app.modules.autenticacao.autenticacao_schema import (
    LoginSchema,
    RecuperarSenhaRequest,
    ResetarSenhaRequest,
    ValidarCodigoRequest,
)
from app.modules.autenticacao.autenticacao_service import AutenticacaoService
from app.modules.core.core_schema import StandardResponse
from prisma import Prisma

router = APIRouter(prefix="/auth", tags=["Autenticação"])

# Initialize limiter
limiter = Limiter(key_func=get_remote_address)


# Custom key function for email-based rate limiting
def get_email_from_request(request: Request) -> str:
    """Extract email from request body for rate limiting."""
    import asyncio
    import json

    # Check if body has already been read
    if hasattr(request.state, "_body"):
        body = request.state._body
    else:
        # This is a workaround - in production use a middleware to cache body
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # If we're in an async context, we can't easily get the body
                # Fall back to IP-based limiting
                return get_remote_address(request)
            body = loop.run_until_complete(request.body())
            request.state._body = body
        except Exception:
            return get_remote_address(request)

    try:
        data = json.loads(body)
        return data.get("email", get_remote_address(request))
    except Exception:
        return get_remote_address(request)


@router.post("/login", response_model=StandardResponse)
async def login(dados: LoginSchema, db: Prisma = Depends(get_prisma)):
    """
    Realiza o login e gera um token JWT. Rota principal usada pelo frontend.
    """
    return await AutenticacaoController.login(dados, db)


@router.post("/recuperar-senha", response_model=StandardResponse)
@limiter.limit("3/hour", key_func=lambda request: request.state._email_for_limit)
async def solicitar_recuperacao(
    request: Request, dados: RecuperarSenhaRequest, db: Prisma = Depends(get_prisma)
):
    """
    Solicita a recuperação de senha enviando um código por e-mail.
    Rate limit: 3 requests per email per hour.
    """
    # Store email for rate limiting
    request.state._email_for_limit = dados.email
    return await AutenticacaoController.solicitar_recuperacao(dados, db)


@router.post("/validar-codigo", response_model=StandardResponse)
@limiter.limit("10/hour")
async def validar_codigo(
    request: Request, dados: ValidarCodigoRequest, db: Prisma = Depends(get_prisma)
):
    """
    Valida o código de recuperação enviado por e-mail.
    Rate limit: 10 requests per IP per hour.
    """
    return await AutenticacaoController.validar_codigo(dados, db)


@router.post("/resetar-senha", response_model=StandardResponse)
@limiter.limit("5/hour")
async def resetar_senha(
    request: Request, dados: ResetarSenhaRequest, db: Prisma = Depends(get_prisma)
):
    """
    Define uma nova senha para o usuário usando o código de recuperação.
    Rate limit: 5 requests per IP per hour.
    """
    return await AutenticacaoController.resetar_senha(dados, db)


@router.post("/token", include_in_schema=False)
async def swagger_login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Prisma = Depends(get_prisma)
):
    """
    Rota exclusiva para o botão 'Authorize' do Swagger UI.
    Recebe form-data (username/password) em vez de JSON.
    """
    dados = LoginSchema(email=form_data.username, senha=form_data.password)
    # O AutenticacaoService já retorna o formato exato esperado pelo Swagger:
    # {"access_token": "...", "token_type": "bearer"}
    return await AutenticacaoService.login(dados, db)