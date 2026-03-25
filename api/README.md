# SGPC — Backend (API)

Backend REST do Sistema SGPC, desenvolvido em **Python/FastAPI** e deployado na **Vercel**.

## Stack

- **Python 3.14+** (instalado via [python.org](https://www.python.org/downloads/), **não** via Microsoft Store)
- **Poetry** — gerenciador de dependências e ambientes virtuais
- **FastAPI** — framework web
- **SQLAlchemy** — ORM
- **Alembic** — migrações de banco
- **PostgreSQL** — banco de dados
- **Uvicorn** — servidor ASGI

---

## Pré-requisitos

### 1. Python (via instalador oficial)

> ⚠️ **Importante:** Instale o Python pelo [python.org](https://www.python.org/downloads/), **não** pela Microsoft Store. A versão da Store causa problemas com o Poetry no Windows.

### 2. Poetry

```bash
# Instalar o Poetry (Windows PowerShell)
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -

# Verificar instalação
poetry --version
```

Após instalar, reinicie o terminal e verifique se `poetry` esta sendo reconhecido.

---

## Como rodar localmente

```bash
# 1. Clonar o repositório e entrar na pasta da API
cd api

# 2. Instalar todas as dependências (cria o virtualenv automaticamente)
poetry install

# 3. Configurar variáveis de ambiente
copy .env.example .env
# Edite .env com suas credenciais do PostgreSQL

# 4. Iniciar o servidor de desenvolvimento
poetry run uvicorn index:app --reload
```

Servidor disponível em: `http://localhost:8000`  
Documentação Swagger: `http://localhost:8000/docs`

---

## Comandos do dia a dia (Poetry)

| Ação | Comando |
|------|---------|
| Instalar dependências | `poetry install` |
| Adicionar nova dependência | `poetry add <pacote>` |
| Adicionar dependência de dev | `poetry add --group dev <pacote>` |
| Remover dependência | `poetry remove <pacote>` |
| Rodar o servidor | `poetry run uvicorn index:app --reload` |
| Rodar qualquer script | `poetry run python <script.py>` |
| Abrir o shell do venv | `poetry shell` |
| Ver dependências instaladas | `poetry show` |
| Atualizar dependências | `poetry update` |
| Gerar `requirements.txt` para deploy | `poetry export -f requirements.txt --output requirements.txt --without-hashes` |

> ℹ️ O `requirements.txt` **não deve ser editado manualmente** — ele é gerado a partir do `pyproject.toml`. Rode o comando acima sempre que adicionar ou remover dependências.

---

## Qualidade de Código (Ruff)

O projeto usa o [Ruff](https://docs.astral.sh/ruff/) para lint e formatação de código. Ele substitui `flake8`, `isort` e `black`.

| Ação | Comando |
|------|---------|
| Verificar erros de lint | `poetry run ruff check .` |
| Corrigir erros automáticos | `poetry run ruff check --fix .` |
| Verificar formatação | `poetry run ruff format --check .` |
| Aplicar formatação | `poetry run ruff format .` |

---

## Estrutura de Pastas

```
api/
├── index.py           # Entry point da aplicação
├── pyproject.toml     # Dependências e config do Poetry
├── poetry.lock        # Lockfile (commitar no git)
├── vercel.json        # Configuração do deploy
├── .env.example       # Template de variáveis de ambiente
└── app/
    ├── config.py      # Configurações via pydantic-settings
    ├── routers/       # Roteadores por recurso
    ├── models/        # Schemas Pydantic
    └── db/
        └── database.py  # Configuração do SQLAlchemy
```

## Deploy (Vercel)

A Vercel usa o `requirements.txt` para instalar as dependências Python. Por isso, **sempre que atualizar dependências, regere o arquivo antes de commitar:**

```bash
poetry export -f requirements.txt --output requirements.txt --without-hashes
```

Passos para conectar:
1. Conectar o repositório no [Vercel](https://vercel.com)
2. Configurar as variáveis de ambiente no painel da Vercel
3. O deploy acontece automaticamente a cada push na branch `main`
