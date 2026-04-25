from fastapi import APIRouter
from src.api.v1 import faces

api_router = APIRouter()
api_router.include_router(faces.router, prefix="/faces", tags=["Faces"])
