# Comandos úteis

## Scripts Auxiliares

Gerar chaves de acesso: `poetry run python gen_key.py` (ou `poetry run python gen_key.py <PERFIL>`)
Popular perfis e permissões: `poetry run python prisma/seed.py`
Popular banco com dados de teste: `poetry run python seed_test_data.py`
Verificar banco: `poetry run python check_db.py`

Rodar o servidor: `poetry run uvicorn index:app --reload`
Rodar o servidor para testar pelo celular: `poetry run uvicorn index:app --host 0.0.0.0 --port 8000`

## docker container para PostgreSQL

docker run --name sgpc-db -e POSTGRES_PASSWORD=senha_forte -p 5432:5432 -d postgres
docker start sgpc-db
docker restart sgpc-db

docker rm <container-id>

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

instalar poetry em OS Linux
curl -sSL https://install.python-poetry.org | python3 - && export PATH="$HOME/.local/bin:$PATH" && poetry --version