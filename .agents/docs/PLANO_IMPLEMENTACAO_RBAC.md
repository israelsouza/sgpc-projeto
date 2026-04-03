# Plano de Implementação Backend: RBAC (Role-Based Access Control)

Este documento detalha a arquitetura de segurança para gerenciar Permissões (Grants) e Perfis (Roles) no sistema, com escopo de Condomínio.

## 🎯 Objetivo
Implementar um controle de acesso granular e seguro baseado no padrão `<acao>:<funcionalidade>`, garantindo que usuários só possam executar ações permitidas pelos seus perfis e dentro do seu escopo (Condomínio/Unidade).

---

## 🏗️ Fase 1: Modelo de Dados (Banco de Dados)
**Arquivo:** `api/prisma/schema.prisma`

### Tarefas:
1. [x] **Criar modelo `Permissao`**:
   - `id` (Int)
   - `nome` (String, Unique) - Padrão `<acao>:<funcionalidade>` (ex: `criar:morador`, `ler:aviso`).
   - `descricao` (String, Opcional).
2. [x] **Atualizar modelo `Perfil`**:
   - Adicionar relacionamento N:N com `Permissao` (`permissoes`).
3. [x] **Sincronização**:
   - Rodar `poetry run prisma db push` e `poetry run prisma generate`.

---

## 🌱 Fase 2: População de Dados (Seed)
**Objetivo:** Garantir que o banco de dados nasça com os perfis e permissões essenciais configurados.

### Tarefas:
1. [x] **Definir Matriz de Permissões**: Mapear quais permissões pertencem a `ADMIN`, `SINDICO`, `PORTEIRO` e `MORADOR`.
2. [x] **Criar Script de Seed**: Criar um script (ex: `api/prisma/seed.py`) para popular automaticamente as tabelas `PERFIS`, `PERMISSOES` e seus vínculos N:N.
3. [x] **Atualizar Testes**: Ajustar o `conftest.py` para usar essa matriz padrão nos ambientes de teste.

---

## 🔒 Fase 3: Lógica de Proteção na API (FastAPI)
**Objetivo:** Interceptar requisições e validar se o usuário possui a permissão requerida e o escopo correto.

### Tarefas:
1. [ ] **Dependência de Permissão**: Criar um validador no FastAPI (ex: `RequirePermission("criar:veiculo")`) que pode ser injetado nas rotas.
2. [ ] **Lógica do Validador**:
   - Extrair o usuário do token JWT.
   - Buscar as permissões associadas aos perfis do usuário.
   - Validar se o `ADMIN` tem "bypass" automático (acesso irrestrito).
3. [ ] **Validação de Escopo (Tenant)**:
   - Além da permissão, garantir que o recurso acessado (ex: deletar morador ID 5) pertence ao mesmo `condominio_id` do usuário logado.

---

## 🧪 Fase 4: Testes de Integração RBAC
### Tarefas:
1. [ ] **Testar Acesso Negado**: Rota protegida deve retornar `403 Forbidden` se o perfil não tiver a permissão.
2. [ ] **Testar Bypass de Admin**: Garantir que o `ADMIN` acessa rotas restritas mesmo sem ter a permissão explicitamente vinculada.
3. [ ] **Testar Isolamento**: Síndico do Condomínio A com permissão `ler:unidade` não deve conseguir acessar unidades do Condomínio B.
