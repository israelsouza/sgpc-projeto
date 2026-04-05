# Evolução do Backend: Padronização e Arquitetura Modular

Este documento detalha a estratégia para elevar a qualidade técnica da API SGPC através da padronização de contratos e da decomposição modular do sistema (SOLID).

---

## 🎯 Objetivo Geral
Transformar o backend em uma arquitetura escalável, onde as responsabilidades sejam bem definidas entre módulos, os erros sejam previsíveis e o contrato de comunicação com o Frontend seja único e consistente.

---

## 🏗️ Fase 1: Padronização de Contratos (API)
**Objetivo:** Garantir que o Frontend receba sempre o mesmo formato de resposta, independente do endpoint.

### 1.1 Centralização de Exceções (`core_exception.py`)
- [x] Criar base `AppError`.
- [x] Implementar `UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404) e `ValidationError` (400).
- [x] **Contrato de Erro:** `{ "nome", "mensagem", "acao", "status_code" }`.

### 1.2 Handler Global (`index.py`)
- [x] Implementar capturador para `AppError`.
- [x] Implementar capturador para `Exception` genérica (Erro 500 estruturado).

### 1.3 Sucessos Padronizados (`core_schema.py`)
- [x] Implementar `StandardResponse[T]`.
- [x] **Contrato de Sucesso:** `{ "message", "status_code", "data": T }`.

---

## 🧩 Fase 2: Reestruturação Modular (Arquitetura)
**Objetivo:** Aplicar os princípios SOLID para evitar "God Classes" no Service e na Controller.

### 2.1 Módulo de Acessos (Chaves)
- [x] Criar módulo `chave`.
- [x] Isolar lógica de geração de UUID e regras de expiração.
- [x] Implementar **Validador de Hierarquia** (Síndico não gera Admin, etc).

### 2.2 Módulo de Autenticação
- [ ] Isolar lógica de login e geração de JWT do `UsuarioService`.
- [ ] Centralizar validação de tokens e segurança.

### 2.3 Módulo de Domínios Especializados
- [ ] **FuncionarioService**: Gestão exclusiva de colaboradores, cargos e permissões profissionais.
- [ ] **MoradorService**: Gestão exclusiva de residentes e vínculos com unidades.
- [ ] **UsuarioService**: Reduzir para atuar apenas como provedor de credenciais básicas.

### 2.4 Módulo de Escopo (Multi-Tenant)
- [ ] Abstrair utilitários para garantir que usuários acessem apenas dados do seu próprio `condominio_id`.

### 2.5 Inspeção de Chaves (Orquestração de Onboarding)
- [ ] **Endpoint de Consulta**: Criar `GET /chaves/validar/{uuid}` (Público).
- [ ] **Lógica de Identificação**: Retornar o Perfil (Morador vs Funcionário) e dados do Condomínio/Unidade sem consumir a chave.
- [ ] **Orientação do App**: Permitir que o Frontend identifique dinamicamente qual formulário exibir e para qual endpoint de registro submeter os dados finais.

---

## 🏗️ Fase 4: Camada de Persistência (Repositories)
**Objetivo:** Isolar o Prisma do restante da aplicação e centralizar regras de infraestrutura (Soft Delete e Multi-tenancy).

### 4.1 Repository Pattern
- [ ] Criar `BaseRepository` com métodos comuns (`find_by_id`, `delete`).
- [ ] Centralizar filtro de **Soft Delete** (`deletado_em is None`) em todas as consultas.

### 4.2 Multi-Tenant Helper
- [ ] Implementar validador automático de escopo por `condominio_id`.

---

## 🧪 Fase 5: Qualidade e Validação
- [x] Manter suíte de testes de integração 100% verde durante a refatoração.
- [x] Ciclo contínuo de Lint (Ruff) e Formatação.
- [ ] Implementar Logs Estruturados (JSON) para observabilidade.

> **💡 Lembrete Estratégico:** Discutir a redução de Boilerplate entre Routers e Controllers no início desta fase, avaliando quando o uso de Controller é realmente necessário.
