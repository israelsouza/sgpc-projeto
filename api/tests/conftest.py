import pytest
from fastapi.testclient import TestClient

from index import app


@pytest.fixture()
def client():
    """Client de teste para a API FastAPI."""
    return TestClient(app)
