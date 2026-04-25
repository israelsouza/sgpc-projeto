# Plano de Ação: Revisão de PR (Coderabbit)

Este plano descreve as ações necessárias para resolver os apontamentos de segurança, performance e robustez levantados pelo CodeRabbit durante a revisão de código da funcionalidade de Recuperação de Senha.

## 1. Segurança e Rate Limiting (Prioridade Alta)

### 1.1 Proteção contra Força Bruta (Rate Limiting)
- **Onde:** `api/app/modules/autenticacao/autenticacao_router.py` e `api/index.py`
- **Ação:** Instalar a biblioteca `slowapi` e configurar um limitador de requisições em memória (ou Redis se disponível).
- **Limites a aplicar:**
  - `solicitar_recuperacao`: Max 3 requisições por hora, por e-mail.
  - `validar_codigo`: Max 10 requisições por hora, por IP.
  - `resetar_senha`: Max 5 requisições por hora, por IP.
- **Atenção:** Garantir que o rate limiter retorne mensagens consistentes para não vazar a existência do e-mail.

### 1.2 Armazenamento Seguro do Código (HMAC)
- **Onde:** `api/app/modules/autenticacao/autenticacao_service.py`
- **Ação:** Nunca salvar o código de 6 dígitos em texto plano no banco de dados. 
- **Implementação:** Gerar o código, calcular um HMAC seguro utilizando a `SECRET_KEY` do sistema, salvar o HMAC no banco e enviar o código em texto claro por e-mail. Na validação e no reset, recalcular o HMAC e usar `secrets.compare_digest`.

### 1.3 Ocultação de PII nos Logs (Redaction)
- **Onde:** `api/app/modules/autenticacao/autenticacao_service.py`
- **Ação:** Remover o e-mail em texto plano das chamadas `logger.bind(email=dados.email)`.
- **Implementação:** Usar uma hash do e-mail (ex: SHA-256 parcial) ou simplesmente omitir/marcar como `<redacted>` até que o `usuario.id` seja identificado e possa ser logado.

### 1.4 Reforço na Verificação de Status e Transação
- **Onde:** `api/app/modules/autenticacao/autenticacao_service.py`
- **Ação 1:** Em `solicitar_recuperacao`, além de verificar `vinc_ativo`, validar se `usuario.status == "ATIVO"`.
- **Ação 2:** No método `resetar_senha`, envolver a atualização da senha e a marcação do código como usado em uma transação assíncrona (`async with db.tx() as transaction:`). Se nenhuma linha de recuperação for afetada (ex: condição de corrida), gerar um `ValidationError`.

## 3. Robustez e API Contract (Prioridade Média)

### 3.1 Configuração do E-mail e Lazy Loading
- **Onde:** `api/app/modules/autenticacao/email_service.py` e `api/app/config.py`
- **Ação 1:** O `ConnectionConfig` deve receber `MAIL_FROM_NAME=settings.MAIL_FROM_NAME`.
- **Ação 2:** Mover a instanciação de `ConnectionConfig` e `FastMail` para dentro da função `enviar_email_recuperacao`. Isso impede que o app trave na inicialização caso haja problema na configuração, tornando a inicialização "lazy".
- **Ação 3:** Validar na inicialização (em `config.py` ou `index.py`) se as credenciais de e-mail não estão vazias quando em ambiente de produção.

### 3.2 Envio de E-mail Não-Bloqueante (Background Tasks)
- **Onde:** `api/app/modules/autenticacao/autenticacao_router.py` e `email_service.py`
- **Ação:** O envio de e-mail com `fastapi-mail` pode demorar e bloquear a requisição. Passar a execução para o `BackgroundTasks` do FastAPI no roteador para que a resposta `200 OK` seja imediata.

### 3.3 Validação de Schemas
- **Onde:** `api/app/modules/autenticacao/autenticacao_schema.py`
- **Ação:** Adicionar restrições usando `Field` no modelo `ResetarSenhaRequest` (ex: `codigo: str = Field(..., min_length=6, max_length=6)`, `nova_senha: str = Field(..., min_length=8)`).

### 3.4 Respostas Seguras no Controller
- **Onde:** `api/app/modules/autenticacao/autenticacao_controller.py`
- **Ação:** Usar `.get("mensagem", "Operação concluída")` ao invés de acesso direto a chaves de dicionário (ex: `resultado["mensagem"]`) para evitar `KeyError`.

## 4. Scripts e Configurações Gerais (Prioridade Baixa)

### 4.1 Correção do Script `mudar_status_pendente.py`
- **Onde:** `api/scripts/mudar_status_pendente.py`
- **Ação:** 
  - Corrigir a discrepância entre a ação (`status: "ATIVO"`) e o log (`print("... PENDENTE")`).
  - Adicionar um bloco `try/finally` para garantir `await db.disconnect()`.
  - Usar `argparse` para receber o e-mail via linha de comando (`--email`) ao invés de hardcode.

### 4.2 Ajustes Ignorados ou Já Resolvidos
- **Testes Async (conftest.py / pyproject.toml):** O apontamento do Coderabbit sobre o `event_loop` vs `pytest-asyncio` já foi resolvido recentemente com a migração correta para a fixture `anyio_backend` no formato `asyncio`. A pipeline já está verde.
- **Dependências (pyproject.toml):** O Coderabbit sugeriu usar ranges semânticos (`>=3.1.6,<4.0.0`) para `jinja2` e `fastapi-mail`. Manteremos a versão estrita (`==3.1.6`) por questões de previsibilidade de segurança, conforme definido inicialmente.
