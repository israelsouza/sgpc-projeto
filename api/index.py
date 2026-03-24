from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import router

app = FastAPI(
    title="SGPC API",
    description="Backend do Sistema de Gerenciamento de Portaria e Controle de Acesso",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ajustar para os domínios corretos em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(router, prefix="/api") # Removed redundant prefix if already in vercel.json or router
app.include_router(router, prefix="/api") 
