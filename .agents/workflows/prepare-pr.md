---
description: Limpeza de código, estágio de alterações e preparação de um pull request
allowed-tools: run_shell_command("git add:*"), run_shell_command("git status:*"), run_shell_command("git diff:*"), run_shell_command("poetry run pytest:*"), run_shell_command("poetry run ruff:*")
---

# SGPC: Pull Request Preparation Checklist

Antes de criar um PR, execute estes passos:

1. **Lint e Formatação:** 
   - `poetry run ruff format .`
   - `poetry run ruff check . --fix`
2. **Testes Automatizados:** 
   - `poetry run pytest`
3. **Revisão de Commits (vs develop):**
   - Verificar histórico: `git log develop..HEAD --oneline`
   - Revisar mudanças técnicas: `git diff develop..HEAD`
4. **Resumo do PR (Baseado nos Commits):**
   - **O que mudou:** (Resumo das funcionalidades implementadas na branch)
   - **Por que mudou:** (Motivação técnica ou de negócio)
   - **Testes realizados:** (Evidência de que os testes passaram)
   - **Impactos potenciais:** (Alterações em banco, novas envs, etc)
