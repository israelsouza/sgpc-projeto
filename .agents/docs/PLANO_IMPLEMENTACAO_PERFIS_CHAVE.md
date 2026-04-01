# Plano de Implementação Backend: Perfis Dinâmicos (V3 - Escala e Multi-Condomínio)

Este documento detalha a arquitetura para suportar múltiplos condomínios, usuários com múltiplos papéis (ex: Síndico que é Morador) e chaves de acesso inteligentes.

## 🎯 Objetivo
Garantir que o sistema suporte o crescimento para vários condomínios e que a segurança seja baseada em vínculos reais (Funcionário/Morador) e não apenas em uma flag no usuário.

---

## 🏗️ Fase 1: Modelo de Dados (Banco de Dados)
**Arquivo:** `api/prisma/schema.prisma`

### Novas Tabelas e Alterações:
1. [ ] **`Condominio`**:
   - `id`, `nome`, `cnpj` (opcional), `endereco`.
2. [ ] **`Unidade`**:
   - Adicionar `condominio_id` (FK). Cada apartamento pertence a um condomínio.
3. [ ] **`Funcionario`**:
   - `id`, `usuario_id` (FK), `condominio_id` (FK), `cargo` (SINDICO, PORTEIRO, ZELADOR), `status`.
   - *Isso permite que um Usuário seja funcionário em um local e morador em outro.*
4. [ ] **`ChaveAcesso` (DNA da Chave)**:
   - `condominio_id` (FK - Obrigatório): Define para onde é o convite.
   - `perfil_id` (FK - Obrigatório): Define se é Morador, Síndico, etc.
   - `unidade_id` (FK - Opcional): Se perfil == MORADOR, define o apartamento.
   - `validade`, `usada`, `quem_criou` (ID do Usuário).

---

## 🚀 Fase 2: Lógica de Registro Inteligente
**Fluxo ao usar uma chave:**

1. **Validação:** A chave diz: "Este convite é para o Perfil X no Condomínio Y".
2. **Criação de Usuário:** Cria o login (e-mail/senha) se ainda não existir.
3. **Criação de Vínculo:**
   - Se `perfil == MORADOR`: Cria registro em `MORADORES` vinculado à `unidade_id` da chave.
   - Se `perfil == SINDICO/PORTEIRO`: Cria registro em `FUNCIONARIOS` vinculado ao `condominio_id` da chave.
   - *Se o usuário já existia (ex: Morador que virou Síndico), ele apenas ganha o novo vínculo.*

---

## 🔒 Fase 3: Segurança e Hierarquia de Admin
1. **SUPER_ADMIN**:
   - Pode gerenciar a tabela de `CONDOMINIOS`.
   - Pode criar `ADMINS` de condomínio (Síndicos) gerando uma chave especial.
2. **SINDICO**:
   - Só pode gerar chaves para o seu próprio `condominio_id`.
   - Só pode visualizar unidades e moradores do seu condomínio.

---

## 📊 Tabelas para o Diagrama (ERD)
Adicionar estas entidades ao seu `Diagrama.png`:

- **`CONDOMINIOS`**: O centro de tudo.
- **`FUNCIONARIOS`**: Liga `USUARIOS` a `CONDOMINIOS` com um cargo.
- **`CHAVES_ACESSO`**: Agora com `condominio_id` e `unidade_id`.
- **`UNIDADES`**: Agora possui `condominio_id`.

---

## 📝 Notas Técnicas
- **Flexibilidade Total**: Um usuário pode ter vários perfis (Morador + Síndico). O sistema verifica as permissões somando os vínculos que ele possui.
- **Segurança**: Chaves de acesso agora são blindadas por condomínio, impedindo que uma chave de um prédio funcione em outro.
