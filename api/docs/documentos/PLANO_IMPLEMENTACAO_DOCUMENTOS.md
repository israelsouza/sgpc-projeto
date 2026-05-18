# Plano de Implementação: Feature de Documentos

## 1. Visão Geral
O objetivo é criar um novo módulo no backend para gerenciar documentos (PDFs) de um condomínio. A implementação seguirá os padrões de arquitetura já existentes no projeto, reutilizando as interfaces de serviço para compressão de PDFs e armazenamento em nuvem (Cloudinary), com forte ênfase em **segurança avançada** (Validações estritas, Auditoria, Integridade e Rate Limiting).

gemini --resume '6c497dd8-6491-45f6-b743-f88f50aa5c73'
To resume this session: gemini --resume '91aee467-87c7-41db-a077-85cb22003cf8'    


## 2. Estrutura de Dados (Backend)

### Tabelas (Prisma)
Será necessário adicionar dois novos `models` ao `prisma/schema.prisma` para representar os documentos e a auditoria de acessos.

```prisma
model Documento {
  id              Int       @id @default(autoincrement())
  titulo          String    @db.VarChar(255)
  descricao       String?
  categoria       String    @db.VarChar(100) // Ex: "Financeiro", "Ata", "Regulamento"
  
  file_id         String    @unique // ID retornado pelo Cloudinary
  filename_orig   String    // Nome original do arquivo (DEVE ser sanitizado antes de salvar)
  sha256_hash     String    // Hash criptográfico para validação de integridade do arquivo
  
  condominio_id   Int
  condominio      Condominio @relation(fields: [condominio_id], references: [id])

  quem_criou_id   Int
  quem_criou      Usuario @relation(fields: [quem_criou_id], references: [id])
  
  criado_em       DateTime  @default(now())
  atualizado_em   DateTime  @updatedAt
  deletado_em     DateTime?

  @@map("documentos")
}

model DocumentoLog {
  id              Int       @id @default(autoincrement())
  documento_id    Int
  usuario_id      Int
  acao            String    @db.VarChar(50) // Ex: "DOWNLOAD", "UPLOAD", "DELETE"
  ip_address      String?   @db.VarChar(45)
  criado_em       DateTime  @default(now())

  @@map("documentos_logs")
}
```
**Ação:** Adicionar estes models e rodar `poetry run prisma generate` e `poetry run prisma db push --skip-generate`.

## 3. Arquitetura do Módulo (Backend)

### Diretrizes de Segurança e Infraestrutura (Transversais)
- **Autorização e Escopo:** Validação estrita do `condominio_id` em todos os endpoints.
- **Rate Limiting (Via slowapi):**
  - **Upload:** Máximo de 10 requisições/hora por usuário.
  - **Download:** Máximo de 100 requisições/hora por usuário.
- **Criptografia em Repouso:** Os documentos utilizarão a criptografia padrão do provedor (AES-256 da AWS gerida pelo Cloudinary). Isso garante segurança em repouso sem perder o benefício de performance das URLs assinadas diretas.

### Principais Endpoints do Router:

1.  **`POST /api/documentos`** (Upload)
    *   **Permissão:** Apenas `ADMIN` e `SINDICO`.
    *   **Segurança:** Rate Limiting (10/h).
    *   Valida: Tamanho (<15MB), Magic Bytes (MIME type real), Integridade do PDF (Tentativa de leitura da estrutura).
    *   **Auditoria:** Registra ação `UPLOAD` na tabela `DocumentoLog`.

2.  **`GET /api/documentos`** (Listagem)
    *   **Permissão:** Todos do condomínio.
    *   **Segurança:** Retornar apenas campos públicos via `DocumentoDisplay` (Omitir `file_id` e `sha256_hash`).

3.  **`GET /api/documentos/{id}`** (Detalhes)
    *   **Permissão:** Todos do condomínio.
    *   **Segurança:** Retornar apenas campos públicos via `DocumentoDisplay` (Omitir `file_id` e `sha256_hash`).

4.  **`GET /api/documentos/{id}/download`** (URL Assinada)
    *   **Permissão:** Todos do condomínio.
    *   **Segurança:** Rate Limiting (100/h). TTL curto (expiração de 15 minutos).
    *   **Headers:** A URL gerada deve incluir flags do Cloudinary (ex: `fl_attachment`) para forçar o browser a baixar o arquivo como anexo e aplicar comportamentos similares ao `Content-Disposition`.
    *   **Auditoria:** Registra ação `DOWNLOAD` na tabela `DocumentoLog`.

5.  **`DELETE /api/documentos/{id}`** (Deleção)
    *   **Permissão:** Apenas `ADMIN` ou `SINDICO`.
    *   **Comportamento (Na Hora do Delete):** O registro sofre _soft-delete_ no banco (`deletado_em`), porém **o arquivo é deletado fisicamente e imediatamente do Cloudinary** (`storage_service.delete_file`). Isso otimiza custos e garante remoção imediata, tornando a restauração do arquivo impossível.
    *   **Auditoria:** Registra ação `DELETE`.

### `DocumentoService` (Com Defesas em Profundidade)

```python
import re
import hashlib
import magic 
import fitz # PyMuPDF

class DocumentoService:
    # ... init ...

    async def criar_documento(self, dados, arquivo_pdf: bytes, filename: str, condominio_id: int, usuario_id: int):
        # 1. Validação de Tamanho (Máximo 15 MB)
        if len(arquivo_pdf) > 15 * 1024 * 1024:
            raise ValidationError(nome="tamanho_invalido", mensagem="Excede 15MB")

        # 2. Validação de Tipo (MIME type real via python-magic)
        if magic.from_buffer(arquivo_pdf, mime=True) != 'application/pdf':
            raise ValidationError(nome="tipo_invalido", mensagem="Apenas PDF")

        # 3. Validação de Estrutura do PDF (Arquivo Corrompido/Vazio)
        try:
            doc = fitz.open(stream=arquivo_pdf, filetype="pdf")
            if doc.page_count < 1:
                 raise ValueError("PDF vazio")
            doc.close()
        except Exception:
            raise ValidationError(nome="arquivo_corrompido", mensagem="PDF inválido ou corrompido")

        # 4. Integridade (SHA-256) e Sanitização
        sha256_hash = hashlib.sha256(arquivo_pdf).hexdigest()
        safe_filename = re.sub(r'[^a-zA-Z0-9_\-\.\s]', '_', filename).strip()

        # 5. Comprimir e Upload
        pdf_comprimido = self.pdf_service.compress_pdf(arquivo_pdf)
        file_id = await self.storage_service.upload_private_file(...)

        # 6. Salvar Metadados
        novo_doc = await DocumentoModel.criar(self.db, {
            "titulo": dados.titulo,
            "file_id": file_id,
            "filename_orig": safe_filename,
            "sha256_hash": sha256_hash,
            # ...
        })

        # 7. Registrar Auditoria
        await DocumentoLogModel.criar(self.db, documento_id=novo_doc.id, usuario_id=usuario_id, acao="UPLOAD")

        return novo_doc
```

## 4. Frontend (App Mobile)

O frontend precisará **apenas** da lógica de integração:

1.  Implementar `documentoService.ts` para consumir a API (listagem e download).
2.  Criar `useDocumentos.ts` para gerenciar estado.
3.  **Uso nas Telas:** Ao clicar em um documento, chamar o endpoint de download. A API auditará o acesso e retornará a URL assinada (já com a flag `fl_attachment` do Cloudinary para forçar headers corretos). O front abre essa URL via `expo-web-browser`.
4.  **Segurança Visual:** Manter a renderização textual padrão do React (`{documento.filename_orig}`) para prevenir injeção HTML.

