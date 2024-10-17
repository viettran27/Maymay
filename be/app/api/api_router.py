from fastapi import APIRouter
from app.api import api_fs, api_maycodinh, api_mayton, api_ppc

router = APIRouter()

router.include_router(api_fs.router, tags=["FS"], prefix="/api_fs")
router.include_router(api_maycodinh.router, tags=["Máy cố định"], prefix="/api_maycodinh")
router.include_router(api_mayton.router, tags=["Máy tồn"], prefix="/api_mayton")
router.include_router(api_ppc.router, tags=["PPC"], prefix="/api_ppc")

