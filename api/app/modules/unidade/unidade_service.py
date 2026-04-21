from app.modules.core.core_exception import ValidationError
from app.modules.unidade.unidade_schema import UnidadeCreate, UnidadeUpdate
from app.modules.condominio.condominio_schema import UnidMassCreation, UnidadeMassResultado
from prisma import Prisma



class UnidadeService:
    @staticmethod
    async def registrar_unidade(dados: UnidadeCreate, db: Prisma):
        # 1. Verificar se unidade já existe
        unidade_existente = await db.unidade.find_first(
            where={"unidade": dados.unidade}
        )

        if unidade_existente:
            raise ValidationError(
                nome="Unidade_Cadastrada",
                mensagem="Esta unidade já está cadastrada no sistema.",
                acao="Caso deseje atualizar, entre nas configurações."
            )

        # 2. Criar unidade
        unidade = await db.unidade.create(
            data=dados.model_dump()
        )
        
        unidade_criada = await db.unidade.find_unique(
            where={"id": unidade.id},
             include={"moradores": True}
            )
        return unidade_criada

    @staticmethod
    async def atualizar_unidade(unid_id: int, dados: UnidadeUpdate, db: Prisma):
        # 1. Verificar se a unidade existe pelo ID
        unidade_existente = await db.unidade.find_unique(
            where={"id": unid_id}
        )

        if not unidade_existente:
            return None

        # 2. Se estiver alterando o nome, verificar duplicidade
        if dados.unidade:
            unid_igual = await db.unidade.find_first(
                where={"unidade": dados.unidade}
            )

            if unid_igual and unid_igual.id != unid_id:
                raise ValidationError(
                    nome="Unidade_Cadastrada",
                    mensagem="Unidade já cadastrada.",
                    acao="Informe um novo nome."
                )

        # 3. Atualizar a unidade
        unidade = await db.unidade.update(
            where={"id": unid_id},
            data=dados.model_dump(exclude_unset=True)
        )
        return unidade

#ANTES BUSCAVA TUDO EM TODOS OS CONDOMINIOS, AGORA APENAS NO COND QUE DESEJAMOS
    @staticmethod
    async def listar_unidades(condominio_id: int, db: Prisma):
        unidades = await db.unidade.find_many(
            where={"condominio_id": condominio_id},
            include={"moradores": True}
        )
        return unidades

    @staticmethod
    async def buscar_unidade_por_id(unid_id: int, db: Prisma):
        return await db.unidade.find_unique(
            where={"id": unid_id}
        )

    @staticmethod
    async def cadastro_massivo(dados: UnidMassCreation, db: Prisma, quem_criou: int | None = None):
        condominio = await db.condominio.find_unique(where={"id": dados.condominio_id})
        if not condominio:
            raise ValidationError(
                nome="Condominio_Nao_Encontrado",
                mensagem="Condomínio não encontrado.",
                acao="Verifique o condominio_id informado."
            )

        if condominio.tipoCond == "PREDIO" and not dados.config_predio:
            raise ValidationError(
                nome="Config_Incorreta",
                mensagem="Este condomínio é do tipo Prédio.",
                acao="Envie config_predio no payload."
            )

        if condominio.tipoCond == "HORIZONTAL" and not dados.config_horizontal:
            raise ValidationError(
                nome="Config_Incorreta",
                mensagem="Este condomínio é do tipo Horizontal.",
                acao="Envie config_horizontal no payload."
            )

        candidatas = UnidadeService._gerar_nomes_unidades(condominio.tipoCond, dados)

        nomes = [c["unidade"] for c in candidatas]
        ja_existentes = await db.unidade.find_many(
            where={"unidade": {"in": nomes}}
        )
        nomes_existentes = {u.unidade for u in ja_existentes}

        a_criar   = [c for c in candidatas if c["unidade"] not in nomes_existentes]
        ignoradas = [c["unidade"] for c in candidatas if c["unidade"] in nomes_existentes]

        criadas = []
        if a_criar:
            payload = [
                {**item, "condominio_id": dados.condominio_id,
                **({"quem_criou": quem_criou} if quem_criou else {})}
                for item in a_criar
            ]
            await db.unidade.create_many(data=payload, skip_duplicates=True)
            criadas = await db.unidade.find_many(
                where={"unidade": {"in": [p["unidade"] for p in payload]},
                    "condominio_id": dados.condominio_id},
                include={"moradores": True}
            )
        
        return UnidadeMassResultado(
            total_solicitado=len(candidatas),
            total_criado=len(criadas),
            total_ignorado=len(ignoradas),
            criadas=criadas,
            ignoradas=ignoradas,
        )

    @staticmethod
    def _gerar_nomes_unidades(tipoCond: str, dados: UnidMassCreation) -> list[dict]:
        if tipoCond == "PREDIO":
            cfg = dados.config_predio
            return [
                {"unidade": f"{andar}{sufixo}", "andar": andar, "bloco": cfg.bloco}
                for andar in range(cfg.andar_inicio, cfg.andar_fim + 1)
                for sufixo in cfg.sufixos
            ]

        cfg = dados.config_horizontal
        return [
            {"unidade": f"{cfg.prefixo} {n}", "andar": None, "bloco": None}
            for n in range(cfg.numero_inicio, cfg.numero_fim + 1)
        ]