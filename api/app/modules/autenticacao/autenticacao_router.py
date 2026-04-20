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

# Initialize limiter for rate limiting
limiter = Limiter(key_func=get_remote_address)


def get_email_from_request_body(request: Request) -> str:
    """Extract email from request body for email-based rate limiting."""
    # This will be called by slowapi - it needs to be synchronous
    # We can't easily access the body here, so we'll use IP-based limiting
    # and implement email-based limiting in the service layer
    return get_remote_address(request)


@router.post("/login", response_model=StandardResponse)
async def login(dados: LoginSchema, db: Prisma = Depends(get_prisma)):
    """
    Realiza o login e gera um token JWT. Rota principal usada pelo frontend.
    """
    return await AutenticacaoController.login(dados, db)


@router.post("/recuperar-senha", response_model=StandardResponse)
@limiter.limit("3/hour")
async def solicitar_recuperacao(
    request: Request, dados: RecuperarSenhaRequest, db: Prisma = Depends(get_prisma)
):
    """
    Solicita a recuperação de senha enviando um código por e-mail.
    Rate limited to 3 requests per hour per IP.
    """
    return await AutenticacaoController.solicitar_recuperacao(dados, db)


@router.post("/validar-codigo", response_model=StandardResponse)
@limiter.limit("10/hour")
async def validar_codigo(
    request: Request, dados: ValidarCodigoRequest, db: Prisma = Depends(get_prisma)
):
    """
    Valida o código de recuperação enviado por e-mail.
    Rate limited to 10 requests per hour per IP.
    """
    return await AutenticacaoController.validar_codigo(dados, db)


@router.post("/resetar-senha", response_model=StandardResponse)
@limiter.limit("5/hour")
async def resetar_senha(
    request: Request, dados: ResetarSenhaRequest, db: Prisma = Depends(get_prisma)
):
    """
    Define uma nova senha para o usuário usando o código de recuperação.
    Rate limited to 5 requests per hour per IP.
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