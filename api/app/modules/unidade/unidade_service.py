from app.modules.core.core_exception import ValidationError
from app.modules.unidade.unidade_schema import UnidadeCreate, UnidadeUpdate
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

    @staticmethod
    async def listar_unidades(db: Prisma):
        unidades = await db.unidade.find_many()
        return unidades

    @staticmethod
    async def buscar_unidade_por_id(unid_id: int, db: Prisma):
        return await db.unidade.find_unique(
            where={"id": unid_id}
        )