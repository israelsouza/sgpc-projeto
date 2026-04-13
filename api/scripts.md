# Comandos úteis

Rodar o servidor `poetry run uvicorn index:app --reload`

## docker container para PostgreSQL

docker run --name sgpc-db -e POSTGRES_PASSWORD=senha_forte -p 5432:5432 -d postgres

## Migrations

poetry run prisma migrate dev --name init_db

## Poetry gerar requirements.txt

poetry export -f requirements.txt --output requirements.txt --without-hashes

## Testes

Rodar todos os testes `poetry run pytest`

Rodar com output detalhado `poetry run pytest -v`

Rodar um arquivo específico `poetry run pytest tests/test_core.py`

Rodar um teste específico `poetry run pytest tests/test_core.py::test_health_check_retorna_200`

## Lint e estilo

Verificar erros de lint `poetry run ruff check .`
Corrigir erros automáticos `poetry run ruff check --fix .`
Verificar formatação `poetry run ruff format --check .`
Aplicar formatação `poetry run ruff format .`
