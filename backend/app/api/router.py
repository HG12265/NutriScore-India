"""Aggregates all API v1 routes."""
from fastapi import APIRouter
from .endpoints import health, info, analyze, history

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(info.router, tags=["Algorithm Metadata"])
api_router.include_router(analyze.router, tags=["NutriScore Analysis"])
api_router.include_router(history.router, tags=["Analysis History"])
