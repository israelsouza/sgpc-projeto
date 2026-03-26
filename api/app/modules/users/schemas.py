from typing import Annotated

from pydantic import BaseModel, EmailStr, Field

Username = Annotated[str, Field(min_length=3, max_length=50, examples=["israel.souza"])]

Email = Annotated[EmailStr, Field(examples=["israel@email.com"])]

FullName = Annotated[
    str, Field(min_length=2, max_length=100, examples=["Israel de Souza"])
]

Password = Annotated[
    str, Field(min_length=8, max_length=128, examples=["SenhaForte123!"])
]

Phone = Annotated[
    str,
    Field(
        pattern=r"^\+?[\d\s\-\(\)]{10,15}$",
        examples=["(11) 99999-9999"],
    ),
]


# ── Schemas ────────────────────────────────────────────────────────


class UserCreate(BaseModel):
    username: Username
    email: Email
    password: Password
    full_name: FullName
    phone: Phone | None = None


class UserResponse(BaseModel):
    id: int = Field(examples=[1])
    username: Username
    email: Email
    full_name: FullName
    phone: Phone | None = None


class UserUpdate(BaseModel):
    username: Username | None = None
    email: Email | None = None
    full_name: FullName | None = None
    phone: Phone | None = None
