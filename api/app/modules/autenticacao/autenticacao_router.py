from fastapi import APIRouter, BackgroundTasks, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm

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
from app.modules.core.limiter import limiter
from prisma import Prisma

# Importar o limiter configurado no app. Em FastAPI, o limiter é tipicamente acessado via request.state.limiter
router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/login", response_model=StandardResponse)
async def login(dados: LoginSchema, db: Prisma = Depends(get_prisma)):
    return await AutenticacaoController.login(dados, db)


@router.post("/recuperar-senha", response_model=StandardResponse)
@limiter.limit("3/hour")
async def solicitar_recuperacao(
    request: Request,
    dados: RecuperarSenhaRequest,
    background_tasks: BackgroundTasks,
    db: Prisma = Depends(get_prisma),
):
    """
    Solicita a recuperação de senha enviando um código por e-mail.
    """
    return await AutenticacaoController.solicitar_recuperacao(
        dados, background_tasks, db
    )


@router.post("/validar-codigo", response_model=StandardResponse)
@limiter.limit("10/hour")
async def validar_codigo(
    request: Request,
    dados: ValidarCodigoRequest,
    db: Prisma = Depends(get_prisma),
):
    """
    Valida o código de recuperação enviado por e-mail.
    """
    return await AutenticacaoController.validar_codigo(dados, db)


@router.post("/resetar-senha", response_model=StandardResponse)
@limiter.limit("5/hour")
async def resetar_senha(
    request: Request,
    dados: ResetarSenhaRequest,
    db: Prisma = Depends(get_prisma),
):
    """
    Define uma nova senha para o usuário usando o código de recuperação.
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
