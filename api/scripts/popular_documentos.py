import asyncio
import base64
import os
import sys

import httpx

# Adiciona a raiz da API ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from prisma import Prisma

# URL pública de um PDF pequeno para popular o banco
PDF_DUMMY_URL = (
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
)


async def main():
    db = Prisma()
    await db.connect()

    print("🌱 Iniciando alimentação de documentos no banco local (B64)...")

    try:
        # 1. Baixar o PDF dummy para salvar no banco
        async with httpx.AsyncClient() as client:
            print(f"📥 Baixando PDF de teste de {PDF_DUMMY_URL}...")
            response = await client.get(PDF_DUMMY_URL)
            if response.status_code != 200:
                print("❌ Falha ao baixar PDF de teste.")
                return
            pdf_bytes = response.content

        # Converter para Base64 para evitar erros de serialização
        pdf_b64 = base64.b64encode(pdf_bytes).decode("utf-8")

        # 2. Buscar usuário autor
        usuario = await db.usuario.find_first(
            where={"perfis": {"some": {"nome": {"in": ["SINDICO", "ADMIN"]}}}}
        )

        if not usuario:
            print("❌ Erro: Nenhum Síndico ou Admin encontrado.")
            return

        condominio_id = None
        if usuario.funcionario:
            condominio_id = usuario.funcionario.condominio_id

        if not condominio_id:
            condo = await db.condominio.find_first()
            if condo:
                condominio_id = condo.id

        if not condominio_id:
            print("❌ Erro: Nenhum condomínio encontrado.")
            return

        docs_para_criar = [
            {
                "titulo": "Regulamento Interno 2026",
                "cat": "Regulamento",
                "file": "regulamento.pdf",
            },
            {
                "titulo": "Ata da Assembleia - Abr/26",
                "cat": "Ata",
                "file": "ata_abr.pdf",
            },
            {
                "titulo": "Financeiro Mensal",
                "cat": "Financeiro",
                "file": "financeiro.pdf",
            },
        ]

        for doc in docs_para_criar:
            await db.documento.create(
                data={
                    "titulo": doc["titulo"],
                    "categoria": doc["cat"],
                    "filename_orig": doc["file"],
                    "file_id": f"local_{doc['file']}",
                    "sha256_hash": "dummy_hash",
                    "conteudo": pdf_b64,  # SALVANDO COMO B64
                    "condominio_id": condominio_id,
                    "quem_criou_id": usuario.id,
                }
            )

        print(f"✅ {len(docs_para_criar)} documentos salvos no banco de dados!")

    except Exception as e:
        print(f"❌ Erro ao popular: {e}")
    finally:
        await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
