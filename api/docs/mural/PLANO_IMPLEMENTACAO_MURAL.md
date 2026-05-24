# Plano de Implementação: Mural de Avisos (Arquitetura Desacoplada com WebSockets)

## 1. Objetivo
Implementar o módulo "Mural de Avisos" no sistema SGPC (backend). O objetivo é permitir que Síndicos e Administradores (ADMIN) publiquem comunicados, garantindo entrega via Notificações Push (Mobile) e atualização instantânea via WebSockets (Painel Web do Porteiro). 
**Arquitetura:** O sistema utilizará interfaces (Ports/Adapters) para serviços de terceiros (Storage, PDF, Push), garantindo baixo acoplamento e facilidade para substituição futura de bibliotecas.

## 2. Escopo e Regras de Negócio
*   **Isolamento por Condomínio:** Um aviso criado no Condomínio A só pode ser visto por usuários do Condomínio A.
*   **Permissões (RBAC):** `criar:aviso`, `atualizar:aviso`, `deletar:aviso`, `ler:aviso`.
*   **Estratégia de Notificação Híbrida:**
    *   **Moradores (App Mobile):** Notificações Push (Interface `PushServiceInterface`, adapter inicial: **FCM**).
    *   **Portaria (Painel Web):** Comunicação via **WebSockets**.
*   **Anexos em PDF:** 
    *   Compressão via Interface `PdfServiceInterface` (adapter inicial: `PyMuPdfAdapter`).
    *   Armazenamento privado via Interface `StorageServiceInterface` (adapter inicial: `CloudinaryAdapter`).
*   **Categorias:** Predefinidas no sistema (ex: MANUTENCAO, ASSEMBLEIA, URGENTE, GERAL).
*   **Tag "Recente":** O backend retornará uma flag booleana `is_recente` (verdadeiro se o aviso foi criado nos últimos 3 dias) na listagem.

## 3. Modelo de Dados (Prisma)
Já concluído na Fase 1.1: Os models `Aviso` e `FCMToken` foram adicionados e os relacionamentos configurados no schema.

## 4. Passos de Implementação

### Fase 1: Banco de Dados e Ambiente (Concluída)
1. Atualizado o `schema.prisma` com os models `Aviso` e `FCMToken`.
2. Adicionado bibliotecas com as versões fixas solicitadas: `PyMuPDF==1.27.2`, `firebase-admin==7.4.0`, `cloudinary==1.44.2`.
3. Adicionar variáveis de ambiente no `.env.example` e `.env` (quando formos implementar).

### Fase 2: Padrão de Interfaces (Ports) e Adapters
1. **Interfaces (`app/core/interfaces/` ou `app/modules/core/interfaces/`):**
    *   Criar `PdfServiceInterface`: com método abstrato `compress_pdf(file_bytes)`.
    *   Criar `StorageServiceInterface`: com métodos abstratos `upload_private_file(file_bytes)` e `generate_signed_url(file_id)`.
    *   Criar `PushServiceInterface`: com método abstrato `send_topic_push(topic, title, body, data)`.
2. **Adapters (Implementações Iniciais):**
    *   `PyMuPdfAdapter`: implementa `PdfServiceInterface`.
    *   `CloudinaryAdapter`: implementa `StorageServiceInterface`.
    *   `FcmPushAdapter`: implementa `PushServiceInterface`.
3. **Injeção de Dependência:** O `AvisoService` dependerá apenas das Interfaces.

### Fase 3: Módulo de Avisos (CRUD)
1. **Schemas:** Criar `app/modules/aviso/aviso_schema.py`.
2. **Serviço:** Criar `app/modules/aviso/aviso_service.py` injetando as dependências `StorageServiceInterface`, `PdfServiceInterface` e `PushServiceInterface`.
3. **Controlador:** Criar `app/modules/aviso/aviso_controller.py`.
4. **Rotas:** Criar `app/modules/aviso/aviso_router.py`.

### Fase 4: Notificações em Tempo Real (WebSockets - Web)
1. **Connection Manager:** Implementar gerenciador de conexões por condomínio em `app/core/websocket_manager.py`.
2. **Endpoint WS:** Criar a rota `/ws/avisos/{condominio_id}` com validação de token.
3. **Broadcast:** O `AvisoService` notificará o `ConnectionManager` de forma assíncrona após a persistência.

### Fase 5: Validação e Testes
1. Criar testes em `tests/test_mural_avisos.py`, utilizando _Mocks_ para as interfaces (`MockStorageService`, `MockPdfService`, `MockPushService`).
2. Validar isolamento e regras de negócio sem acionar serviços de terceiros (o que demonstra o valor da nova arquitetura).
