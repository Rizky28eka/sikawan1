import cv2
import numpy as np
import os
import joblib
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from src.services.recognition_service import RecognitionService
from src.services.registration_service import RegistrationService
from src.services.training_service import TrainingService
from src.core.config import settings

router = APIRouter()

# Schema untuk Laravel verify-inference
class InferenceRequest(BaseModel):
    image_base64: str
    reference_embedding: Optional[List[float]] = None

class RegisterBase64Request(BaseModel):
    user_id: str
    image_base64: str

class DynamicFrameRequest(BaseModel):
    image_base64: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None

# Global Services
recognition_svc = RecognitionService()
registration_svc = RegistrationService()
registration_svc.recognition_svc = recognition_svc # Inject for identity conflict check
training_svc = TrainingService()

@router.post("/dynamic-register-frame")
async def dynamic_register_frame(request: DynamicFrameRequest):
    """
    Endpoint untuk feedback real-time saat registrasi di Web/Mobile.
    """
    try:
        import base64
        img_data = base64.b64decode(request.image_base64.split(",")[-1])
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {"face_found": False, "message": "Invalid image"}
            
        return registration_svc.validate_frame(img)
    except Exception as e:
        return {"face_found": False, "message": str(e)}

@router.post("/dynamic-verify-frame")
async def dynamic_verify_frame(request: DynamicFrameRequest):
    """
    Endpoint untuk feedback real-time saat absensi/login di Web/Mobile.
    """
    try:
        # Re-use verifikasi standar tapi dalam mode 'dynamic'
        result = recognition_svc.verify_inference(request.image_base64)
        return {
            "face_found": result.get("recognized", False),
            "confidence": result.get("confidence", 0),
            "user_id": result.get("user_id"),
            "bbox": result.get("bbox")
        }
    except Exception as e:
        return {"face_found": False, "message": str(e)}

@router.post("/verify-inference")
async def verify_inference(request: InferenceRequest):
    """
    Endpoint utama untuk integrasi Laravel AttendanceController (Web/Check-in/Check-out).
    """
    result = recognition_svc.verify_inference(request.image_base64, request.reference_embedding)
    return result

@router.post("/register-base64")
async def register_base64(request: RegisterBase64Request):
    """Pendaftaran user via Base64 JSON (Sesuai Laravel ProfileController)."""
    try:
        import base64
        img_data = base64.b64decode(request.image_base64.split(",")[-1])
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image data")
            
        return registration_svc.register(request.user_id, img)
    except Exception as e:
        return {"success": False, "message": str(e)}

@router.post("/register")
async def register(user_id: str = Form(...), file: UploadFile = File(...)):
    """Pendaftaran user via upload file kustom."""
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return registration_svc.register(user_id, img)
    except Exception as e:
        return {"success": False, "message": str(e)}

@router.post("/train")
async def train(background_tasks: BackgroundTasks):
    """Trigger pelatihan ulang KNN & Update Akurasi secara Asinkron."""
    def run_training():
        try:
            results = training_svc.retrain()
            recognition_svc.refresh_model()
            
            # Tampilkan hasil di terminal (User Request)
            accuracy = results.get("accuracy_percent", "0%")
            print("\n" + "-"*30)
            print(f"✅ MODEL UPDATED: Haar Cascade + KNN")
            print(f"📈 NEW ACCURACY: {accuracy}")
            print("-"*30 + "\n")
        except Exception as e:
            print(f"Background Training Error: {e}")

    background_tasks.add_task(run_training)
    
    return {
        "success": True, 
        "message": "Pelatihan ulang dimulai di background. Model akan diperbarui dalam beberapa saat."
    }

@router.get("/status")
async def status():
    """Status Engine AI & Laporan Akurasi Skripsi."""
    metrics_path = os.path.join(settings.model_dir, "metrics.joblib")
    acc_path = os.path.join(settings.model_dir, "accuracy.joblib")
    
    metrics = {}
    if os.path.exists(metrics_path):
        metrics = joblib.load(metrics_path)
    elif os.path.exists(acc_path):
        metrics = {"accuracy": joblib.load(acc_path)}
    
    return {
        "engine": "Haar Cascade + KNN (Skripsi Compliance)",
        "detector_loaded": recognition_svc.detector.face_cascade is not None,
        "model_loaded": recognition_svc.knn is not None,
        "class_count": len(recognition_svc.class_names),
        "metrics": metrics if metrics else "Belum dilatih"
    }
