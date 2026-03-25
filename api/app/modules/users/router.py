from fastapi import APIRouter

router = APIRouter()


@router.get("/", tags=["Users"])
def read_users():
    return [{"username": "israel"}]
