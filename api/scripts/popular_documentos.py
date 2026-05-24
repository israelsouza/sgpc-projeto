import asyncio
import os
import sys

# Adiciona a raiz da API ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from prisma import Prisma

# URL pública que funciona para a apresentação
MOCK_FILE_ID = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

async def main():
    db = Prisma()
    await db.connect()

    print("🌱 Iniciando alimentação de documentos para apresentação...")
    
    try:
        # Precisamos de um síndico ou admin para ser o autor
        usuario = await db.usuario.find_first(
            where={"perfis": {"some": {"nome": {"in": ["SINDICO", "ADMIN"]}}}}
        )
        
        if not usuario:
            print("❌ Erro: Nenhum Síndico ou Admin encontrado no banco.")
            return

        # Condomínio vinculado ao usuário
        condominio_id = None
        if usuario.funcionario:
            condominio_id = usuario.funcionario.condominio_id
        
        if not condominio_id:
            # Busca qualquer condomínio se o usuário não tiver vínculo direto (admin)
            condo = await db.condominio.find_first()
            if condo:
                condominio_id = condo.id

        if not condominio_id:
            print("❌ Erro: Nenhum condomínio encontrado no banco.")
            return

        docs_para_criar = [
            {
                "titulo": "Regulamento Interno 2026",
                "categoria": "Regulamento",
                "filename_orig": "regulamento_interno.pdf",
                "file_id": "mock_reg_2026", # Simulamos um ID de nuvem
                "sha256_hash": "fake_hash_1"
            },
            {
                "titulo": "Ata da Assembleia Geral - Abr/2026",
                "categoria": "Ata",
                "filename_orig": "ata_assembleia_abr.pdf",
                "file_id": "mock_ata_abr",
                "sha256_hash": "fake_hash_2"
            },
            {
                "titulo": "Prestação de Contas Mensal",
                "categoria": "Financeiro",
                "filename_orig": "financeiro_marco.pdf",
                "file_id": "mock_fin_mar",
                "sha256_hash": "fake_hash_3"
            }
        ]

        for doc in docs_para_criar:
            await db.documento.create(
                data={
                    "titulo": doc["titulo"],
                    "categoria": doc["categoria"],
                    "filename_orig": doc["filename_orig"],
                    "file_id": doc["file_id"],
                    "sha256_hash": doc["sha256_hash"],
                    "condominio_id": condominio_id,
                    "quem_criou_id": usuario.id
                }
            )
        
        print(f"✅ {len(docs_para_criar)} documentos de teste criados com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro ao popular documentos: {e}")
    finally:
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
