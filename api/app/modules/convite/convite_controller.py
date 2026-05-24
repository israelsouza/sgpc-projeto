from fastapi import Request
from fastapi.templating import Jinja2Templates

from app.db.prisma_client import get_prisma
from app.modules.convite.convite_schema import ConviteCreate, VisitanteCreate
from app.modules.convite.convite_service import ConviteService
from app.modules.core.core_exception import ValidationError

templates = Jinja2Templates(directory="app/templates")


class ConviteController:
    @staticmethod
    async def gerar(usuario_id: int, dados: ConviteCreate):
        db = await get_prisma()

        # Buscar o ID do morador vinculado ao usuário
        morador = await db.morador.find_unique(where={"usuario_id": usuario_id})
        if not morador:
            raise ValidationError(
                nome="morador_nao_encontrado",
                mensagem="Apenas moradores podem gerar convites.",
                acao="Verifique se seu perfil está configurado corretamente.",
            )

        return await ConviteService.gerar_convite(db, morador.id, dados)

    @staticmethod
    async def renderizar_formulario(token: str, request: Request):
        db = await get_prisma()
        convite = await ConviteService.validar_token(db, token)

        if not convite:
            return templates.TemplateResponse(
                "erro_convite.html",
                {"request": request, "mensagem": "Este link expirou ou é inválido."},
            )

        tipo_label = "Visitante" if convite.tipo == "VISITANTE" else "Prestador de Serviço"

        return templates.TemplateResponse(
            "cadastro_visitante.html",
            {
                "request": request,
                "token": token,
                "morador_nome": convite.morador.nome_completo,
                "tipo_label": tipo_label,
            },
        )

    @staticmethod
    async def registrar(token: str, dados: VisitanteCreate):
        db = await get_prisma()
        return await ConviteService.registrar_visitante(db, token, dados)

    @staticmethod
    async def listar_visitantes(usuario_id: int):
        db = await get_prisma()

        # 1. Buscar o morador vinculado ao usuário logado
        morador_logado = await db.morador.find_unique(where={"usuario_id": usuario_id})
        if not morador_logado or not morador_logado.unidade_id:
            return []

        # 2. Buscar todos os IDs de moradores que pertencem à mesma unidade
        moradores_unidade = await db.morador.find_many(
            where={"unidade_id": morador_logado.unidade_id}
        )
        ids_moradores = [m.id for m in moradores_unidade]

        # 3. Listar visitantes vinculados a qualquer um desses moradores
        visitantes = await db.visitante.find_many(
            where={"morador_id": {"in": ids_moradores}}, order={"criado_em": "desc"}
        )

        return [v.model_dump() for v in visitantes]
