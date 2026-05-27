import asyncio

from fastapi import APIRouter, Depends

from app.db.prisma_client import get_prisma
from app.modules.core.auth import get_current_user
from app.modules.core.historico_schema import HistoricoItem
from prisma import Prisma

router = APIRouter(prefix="/historico", tags=["Historico"])


@router.get("", response_model=list[HistoricoItem])
async def listar_historico(
    limit: int = 10,
    offset: int = 0,
    usuario_logado=Depends(get_current_user),
    db: Prisma = Depends(get_prisma),
):
    usuario_id = int(usuario_logado["sub"])

    usuario = await db.usuario.find_unique(
        where={"id": usuario_id},
        include={"morador": True, "funcionario": True, "perfis": True},
    )

    roles = [p.nome for p in usuario.perfis]
    is_gestao = "SINDICO" in roles or "ADMIN" in roles or "PORTEIRO" in roles

    # Consultas em paralelo para performance
    # Ajustamos o 'take' para pegar um pouco mais e permitir ordenação global
    take_per_query = limit + offset
    tasks = []

    # 1. Visitantes
    where_visitante = {}
    if not is_gestao and usuario.morador:
        where_visitante = {"morador_id": usuario.morador.id}
    tasks.append(
        db.visitante.find_many(
            where=where_visitante, order={"criado_em": "desc"}, take=take_per_query
        )
    )

    # 2. Bilhetes
    where_bilhete = {}
    if not is_gestao and usuario.morador:
        where_bilhete = {"morador_id": usuario.morador.id}
    tasks.append(
        db.bilhetes.find_many(
            where=where_bilhete, order={"criado_em": "desc"}, take=take_per_query
        )
    )

    # 3. Reservas
    where_reserva = {}
    if not is_gestao:
        where_reserva = {"usuario_id": usuario_id}
    tasks.append(
        db.reserva.find_many(
            where=where_reserva,
            include={"espaco": True},
            order={"data_reserva": "desc"},
            take=take_per_query,
        )
    )

    # 4. Manifestações
    where_manifestacao = {}
    if not is_gestao and usuario.morador:
        where_manifestacao = {"morador_id": usuario.morador.id}
    tasks.append(
        db.manifestacao.find_many(
            where=where_manifestacao, order={"criado_em": "desc"}, take=take_per_query
        )
    )

    results = await asyncio.gather(*tasks)

    visitantes, bilhetes, reservas, manifestacoes = results

    historico_unificado = []

    # Mapeamento Visitantes
    for v in visitantes:
        historico_unificado.append(
            HistoricoItem(
                id=f"vis_{v.id}",
                titulo="Aviso de visita",
                subtitulo=f"Visitante: {v.nome_completo}",
                tipo="VISITANTE",
                data=v.criado_em,
                icon_name="user",
                icon_library="Feather",
                icon_bg="#D6E8F7",
                icon_color="#5B9BC4",
            )
        )

    # Mapeamento Bilhetes
    for b in bilhetes:
        historico_unificado.append(
            HistoricoItem(
                id=f"bil_{b.id}",
                titulo="Bilhete enviado",
                subtitulo=b.assunto,
                tipo="BILHETE",
                data=b.criado_em,
                icon_name="mail",
                icon_library="Feather",
                icon_bg="#D6F5E3",
                icon_color="#4CAF73",
            )
        )

    # Mapeamento Reservas
    for r in reservas:
        historico_unificado.append(
            HistoricoItem(
                id=f"res_{r.id}",
                titulo="Agendamento realizado",
                subtitulo=f"Local: {r.espaco.nome}",
                tipo="RESERVA",
                data=r.data_reserva,
                icon_name="calendar",
                icon_library="Feather",
                icon_bg="#F5E6D6",
                icon_color="#B87C4A",
            )
        )

    # Mapeamento Manifestações
    for m in manifestacoes:
        historico_unificado.append(
            HistoricoItem(
                id=f"man_{m.id}",
                titulo="Chamado aberto",
                subtitulo=m.assunto,
                tipo="MANIFESTACAO",
                data=m.criado_em,
                icon_name="file-text",
                icon_library="Feather",
                icon_bg="#F7D6D6",
                icon_color="#C45B5B",
            )
        )

    # Ordena tudo por data
    historico_unificado.sort(key=lambda x: x.data, reverse=True)

    # Aplica o fatiamento da paginação manualmente após a unificação
    return historico_unificado[offset : offset + limit]
