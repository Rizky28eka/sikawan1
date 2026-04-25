import cv2
import numpy as np
import logging
import base64
from typing import Dict, Any, Optional, List
from src.ml.face_detector import FaceDetector
from src.ml.embedding import FeatureExtractor
from src.ml.trainer import KNNTrainer
from src.ml.quality_validator import QualityValidator
from src.core.config import settings

logger = logging.getLogger(__name__)

class RecognitionService:
    """
    Service untuk pengenalan (Inference) dan verifikasi.
    Mendukung format response yang diharapkan oleh Laravel.
    """
    def __init__(self):
        self.detector = FaceDetector()
        self.validator = QualityValidator()
        self.extractor = FeatureExtractor()
        self.trainer = KNNTrainer()
        self.knn, self.class_names = self.trainer.load_model()

    def refresh_model(self):
        self.knn, self.class_names = self.trainer.load_model()

    def verify_inference(self, image_base64: str, reference_embedding: Optional[List[float]] = None) -> Dict[str, Any]:
        """
        Endpoint utama untuk Laravel AttendanceController.
        Returns: recognized (bool), confidence (float), distance (float), etc.
        """
        # 1. Decode Image
        try:
            # Hapus header data:image/jpeg;base64, jika ada
            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]
            img_data = base64.b64decode(image_base64)
            nparr = np.frombuffer(img_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None:
                 return {"recognized": False, "message": "Gagal decode gambar (image is None)", "confidence": 0}
        except Exception as e:
            return {"recognized": False, "message": f"Gagal decode gambar: {e}", "confidence": 0}

        # 2. Detect & Quality Validation
        det = self.detector.detect_face(image)
        if not det:
            return {
                "recognized": False, 
                "message": "Wajah tidak terdeteksi", 
                "suggestion": "Pastikan wajah menghadap kamera dengan jelas",
                "confidence": 0
            }
        
        face_crop, bbox = det
        quality = self.validator.validate_quality(face_crop)
        
        # 3. Extract embedding
        embedding = self.extractor.extract_embedding(image, bbox)
        if embedding is None:
            return {"recognized": False, "message": "Gagal mengekstrak fitur wajah", "confidence": 0}

        # 4. Compare or KNN
        if reference_embedding:
            ref_emb = np.array(reference_embedding, dtype=np.float32)
            match, distance = self.extractor.compare_faces(embedding, ref_emb)
            
            # Linear mapping: 0.0 dist = 100%, 0.6 dist = 50%, >1.0 dist = 0%
            confidence = max(0, 100 * (1 - distance / (settings.recognition_threshold * 2)))
            
            # Sanitization (NaN/Inf)
            if np.isnan(confidence) or np.isinf(confidence): confidence = 0.0
            if np.isnan(distance) or np.isinf(distance): distance = 0.0

            return {
                "recognized": match,
                "confidence": float(confidence),
                "distance": float(distance),
                "quality_feedback": quality.get("reason"),
                "quality_metrics": quality.get("metrics", {}),
                "message": "Verifikasi 1-ke-1 selesai" if match else "Wajah tidak cocok dengan referensi",
                "confidence_threshold": settings.recognition_threshold
            }

        # 5. Fallback to KNN (Who is this?)
        if self.knn is None:
            return {"recognized": False, "message": "Model KNN belum dilatih", "confidence": 0}

        # Predict
        try:
            dist, idx = self.knn.kneighbors(embedding.reshape(1, -1))
            avg_dist = np.mean(dist[0])
            predicted_uid = self.knn.predict(embedding.reshape(1, -1))[0]
            
            match = avg_dist <= settings.recognition_threshold
            confidence = max(0, 100 * (1 - avg_dist / (settings.recognition_threshold * 2)))
            
            # Sanitization
            if np.isnan(confidence) or np.isinf(confidence): confidence = 0.0
            if np.isnan(avg_dist) or np.isinf(avg_dist): avg_dist = 0.0

            return {
                "recognized": bool(match),
                "user_id": str(predicted_uid),
                "confidence": float(confidence),
                "distance": float(avg_dist),
                "quality_feedback": quality.get("reason"),
                "quality_metrics": quality.get("metrics", {}),
                "message": f"Dikenali sebagai {predicted_uid}" if match else "User tidak ditemukan di dataset"
            }
        except Exception as e:
            return {"recognized": False, "message": f"Kerror KNN: {e}", "confidence": 0}
