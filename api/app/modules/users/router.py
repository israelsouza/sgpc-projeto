from fastapi import APIRouter, HTTPException

from app.modules.users.schemas import UserCreate, UserResponse, UserUpdate

router = APIRouter()

fake_db: list[dict] = [
    {
        "id": 1,
        "username": "israel.souza",
        "email": "israel@email.com",
        "password": "hashed_password_123",
        "full_name": "Israel de Souza",
    },
    {
        "id": 2,
        "username": "joao.lopes",
        "email": "joao.mario@email.com",
        "password": "hashed_password_123",
        "full_name": "João Lopes",
    },
    {
        "id": 3,
        "username": "maria.silva",
        "email": "maria@email.com",
        "password": "hashed_password_123",
        "full_name": "Israel de Souza",
    },
    {
        "id": 4,
        "username": "israel.souza",
        "email": "israel@email.com",
        "password": "hashed_password_123",
        "full_name": "Israel de Souza",
    },
    {
        "id": 5,
        "username": "israel.souza",
        "email": "israel@email.com",
        "password": "hashed_password_123",
        "full_name": "Israel de Souza",
    },
]


@router.get("/", tags=["Users"], response_model=list[UserResponse])
def list_users():
    return fake_db


@router.get("/{user_id}", tags=["Users"], response_model=UserResponse)
def get_user(user_id: int):
    user = next((u for u in fake_db if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user


@router.post("/", tags=["Users"], response_model=UserResponse, status_code=201)
def create_user(user: UserCreate):
    new_user = {
        "id": len(fake_db) + 1,
        **user.model_dump(exclude={"password"}),
        "password": f"hashed_{user.password}",
    }
    fake_db.append(new_user)
    return new_user


@router.patch("/{user_id}", tags=["Users"], response_model=UserResponse)
def update_user(user_id: int, user: UserUpdate):
    existing = next((u for u in fake_db if u["id"] == user_id), None)
    if not existing:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    update_data = user.model_dump(exclude_unset=True)
    existing.update(update_data)
    return existing
