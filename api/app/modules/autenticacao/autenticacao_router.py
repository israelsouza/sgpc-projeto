from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.db.prisma_client import get_prisma
from app.modules.autenticacao.autenticacao_controller import AutenticacaoController
from app.modules.autenticacao.autenticacao_schema import LoginSchema
from app.modules.autenticacao.autenticacao_service import AutenticacaoService
from app.modules.core.core_schema import StandardResponse
from prisma import Prisma

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/login", response_model=StandardResponse)
async def login(dados: LoginSchema, db: Prisma = Depends(get_prisma)):
    """
    Realiza o login e gera um token JWT. Rota principal usada pelo frontend.
    """
    return await AutenticacaoController.login(dados, db)


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
