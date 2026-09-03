"""Trip route module. Current routes are registered in app.main during migration."""
from fastapi import APIRouter
router = APIRouter(prefix="/api/trips", tags=["trips"])
