# SGPC — Backend (API)

Backend REST do Sistema SGPC, desenvolvido em **Python/FastAPI** e deployado na **Vercel**.

## Stack
- **Python 3.12**
- **FastAPI** — framework web
- **SQLAlchemy** — ORM
- **Alembic** — migrações de banco
- **PostgreSQL** — banco de dados
- **Uvicorn** — servidor ASGI

## Como rodar localmente

```bash
# 1. Criar e ativar o ambiente virtual
python -m venv venv
venv\Scripts\activate   # Windows

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Configurar variáveis de ambiente
copy .env.example .env
# Edite .env com suas credenciais do PostgreSQL

# 4. Rodar o servidor
uvicorn index:app --reload
```

Servidor disponível em: `http://localhost:8000`
Documentação Swagger: `http://localhost:8000/docs`

## Estrutura de Pastas

```
api/
├── index.py           # Entry point da aplicação
├── requirements.txt   # Dependências Python
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

1. Conectar o repositório no [Vercel](https://vercel.com)
2. Configurar as variáveis de ambiente no painel da Vercel
3. O deploy acontece automaticamente a cada push na branch `main`
