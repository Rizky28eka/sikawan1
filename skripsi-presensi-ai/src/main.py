import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from src.core.config import settings
from src.api.v1.router import api_router

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s"
)
logger = logging.getLogger("main")

app = FastAPI(
    title="Smart Attendance AI Service V3",
    description="Haar Cascade + KNN Engine (Skripsi Compliance)",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "service": "Smart Attendance AI Service V3",
        "engine": "Haar Cascade + KNN (HOG 128D)",
        "status": "ready"
    }

@app.get("/health")
async def health():
    return {"status": "ok", "message": "AI Service is healthy"}


@app.on_event("startup")
async def startup_event():
    # Tampilkan status model saat start
    import os
    import joblib
    from src.core.config import settings
    
    acc_path = os.path.join(settings.model_dir, "accuracy.joblib")
    accuracy = joblib.load(acc_path) if os.path.exists(acc_path) else "0% (Belum dilatih)"
    
    print("\n" + "="*50)
    print("🚀 SMART ATTENDANCE AI SERVICE STARTED")
    print(f"🤖 Model  : Haar Cascade + KNN (V3.0.0)")
    print(f"📈 Accuracy: {accuracy}")
    print("="*50 + "\n")

if __name__ == "__main__":
    uvicorn.run("src.main:app", host=settings.app_host, port=settings.app_port, reload=True)
