import cv2
import numpy as np
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class QualityValidator:
    """
    Validasi kualitas gambar wajah (Pencahayaan, Ketajaman).
    """
    def validate_quality(self, image: np.ndarray) -> Dict[str, Any]:
        """
        Input: BGR Image (Crop wajah).
        """
        if image is None or image.size == 0:
            return {"is_quality_ok": False, "reason": "No image", "level": "error"}

        # 1. Cek Pencahayaan (Brightness)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        brightness = np.mean(gray)
        
        # 2. Cek Ketajaman (Sharpness via Laplacian)
        sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        # Thresholds (Sesuai eksperimen umum Haar Cascade)
        min_brightness = 50
        max_brightness = 230
        min_sharpness = 30
        
        is_ok = True
        level = "good"
        reason = ""
        
        if brightness < min_brightness:
            is_ok = False
            level = "dark"
            reason = "Pencahayaan terlalu gelap"
        elif brightness > max_brightness:
            is_ok = False
            level = "bright"
            reason = "Pencahayaan terlalu terang"
        elif sharpness < min_sharpness:
            is_ok = False
            level = "blurry"
            reason = "Gambar buram/tidak fokus"
            
        return {
            "is_quality_ok": is_ok,
            "quality_level": level,
            "reason": reason,
            "metrics": {
                "brightness": float(brightness),
                "sharpness": float(sharpness)
            }
        }
