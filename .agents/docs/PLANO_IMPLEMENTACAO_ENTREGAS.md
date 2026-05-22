# Plano de Implementação: Módulo de Entregas

## Objetivo
Implementar o módulo completo de Entregas, permitindo que:
- **Moradores:** Registrem expectativas de entrega, visualizem seus pacotes e acompanhem o status.
- **Porteiros:** Registrem a chegada de entregas (mesmo que o morador não tenha avisado), atualizem o status para `RECEBIDA` e confirmem a entrega ao morador (`RETIRADA`).
- **Sistema:** Envie notificações push ao morador na recepção do item e emita eventos WebSocket em tempo real para o porteiro na criação de expectativas.

## Contexto e Arquitetura
A implementação utilizará a stack padrão do projeto:
- **Backend:** FastAPI, Prisma (Python), PostgreSQL, e FCM (Push Notifications) com WebSockets (`websocket_manager`).
- **Frontend:** React Native, Expo, e arquitetura de 3 camadas (Services, Hooks, Componentes/Telas).
- **Banco de Dados:** Modelo `Entrega` com rastreabilidade de quem recebeu o item.

## 1. Banco de Dados (Prisma)
Adição no `api/prisma/schema.prisma`:
```prisma
enum StatusEntrega {
  AGUARDANDO
  RECEBIDA
  RETIRADA
  CANCELADA
}

enum CategoriaEntrega {
  CARTA
  PACOTE
}

model Entrega {
  id                         Int              @id @default(autoincrement())
  morador_id                 Int              @map("morador_id")
  tipo                       CategoriaEntrega @map("tipo")
  status                     StatusEntrega    @default(AGUARDANDO) @map("status")
  prazo_retirada             DateTime?        @map("prazo_retirada")
  mensagem                   String?          @map("mensagem")
  observacao_porteiro         String?          @map("observacao_porteiro")
  justificativa_cancelamento String?          @map("justificativa_cancelamento")

  criado_em                  DateTime         @default(now()) @map("criado_em")
  atualizado_em              DateTime         @updatedAt @map("atualizado_em")
  deletado_em                DateTime?        @map("deletado_em")
  quem_criou                 Int?             @map("quem_criou")
  quem_recebeu               Int?             @map("quem_recebeu")

  morador                    Morador          @relation(fields: [morador_id], references: [id])

  @@map("ENTREGAS")
}
```
*Lembrar de adicionar `entregas Entrega[]` no model `Morador`.*
- Gerar e aplicar migrations (`prisma format` e `prisma db push` ou `prisma migrate dev`).

## 2. Backend (FastAPI - `api/app/modules/entrega/`)
- **entrega_schema.py:** Schemas Pydantic (Create, Update, StatusUpdate, Response).
- **entrega_model.py:** Funções de acesso ao banco (CRUD).
- **entrega_service.py:** Regras de negócio e RBAC.
  - **Criação:** 
    - Morador cria "expectativa" (`AGUARDANDO`). Dispara WebSocket para o porteiro.
    - Porteiro cria entrega direta (`RECEBIDA`). Dispara Push Notification para o morador.
  - **Listagem:** 
    - Moradores veem apenas as suas.
    - Porteiros veem todas do condomínio, com suporte a filtros (apartamento/morador).
  - **Atualização de Status (`PATCH /entregas/{id}/status`):**
    - Implementar máquina de estados (ex: `AGUARDANDO` → `RECEBIDA` → `RETIRADA`).
    - Se alterado para `RECEBIDA`, usar `FcmPushAdapter` para notificar o morador.
    - Se `CANCELADA`, exigir `justificativa_cancelamento`.
- **entrega_controller.py:** Camada de controle e validação.
- **entrega_router.py:** Rotas com injeção de dependências para verificar se o usuário é Morador ou Porteiro.
- **app/routers/__init__.py:** Inclusão do router de entregas no `api_router`.

## 3. Frontend (React Native - `front/src/`)
### Camada de Service (`src/services/entregaService.ts`)
- Métodos REST (GET, POST, PATCH) para o endpoint `/entregas`.

### Camada de Hook (`src/hooks/useEntrega.ts`)
- Gerenciamento de estado, loading, erro e integração com `entregaService`.

### Integração nas Telas (`app/Entregas/`)
- **Visão do Morador:**
  - **Entregas.tsx:** Lista de pacotes do morador (Expectativas vs Recebidos).
  - **NovaEntrega.tsx:** Formulário para registrar expectativa de entrega.
  - **ResumoEntrega.tsx:** Detalhes e opção de cancelar a expectativa.
- **Visão do Porteiro (Painel de Gestão):**
  - **PainelEntregas.tsx:** Lista global de entregas com filtros de busca por unidade/morador.
  - **Ações Rápidas:** Botão de "Confirmar Retirada" (1-click) e "Marcar como Recebido".
  - **FormularioRecebimento.tsx:** Para registrar novas entregas que chegam sem aviso.

## 4. Testes e Verificação
- **Banco de Dados:** Validar aplicação da migration e integridade das FKs.
- **API:** Testar fluxos via Swagger UI:
  - Criação por morador → Notificação Porteiro.
  - Recebimento por porteiro → Notificação Morador.
  - Validação de erro ao tentar transições de status inválidas.
- **Frontend:**
  - Testar fluxo completo: Registro $\rightarrow$ Recebimento $\rightarrow$ Retirada.
  - Validar responsividade da lista do porteiro com múltiplos itens.
- **Infra:** Validar entrega de notificações push via tokens FCM reais.

Resumo dos planos em:
claude --resume fe6e9c84-20be-4dc9-b461-6db455786d81
gemini --resume 'e185433f-587c-4a73-97cd-ced6239cbf4f' 
