import os
import cv2
import numpy as np
import logging
from typing import Optional, Tuple, Any
from src.core.config import settings

logger = logging.getLogger(__name__)

class FaceDetector:
    """
    Detektor wajah menggunakan OpenCV Haar Cascade sesuai ketentuan skripsi.
    """
    def __init__(self):
        # Path ke file XML Haar Cascade
        self.cascade_path = os.path.join(settings.model_dir, "haarcascade_frontalface_default.xml")
        
        if not os.path.exists(self.cascade_path):
            # Fallback path (mungkin ada di sistem brew/apt)
            default_xml = "/opt/homebrew/share/opencv4/haarcascades/haarcascade_frontalface_default.xml"
            if os.path.exists(default_xml):
                self.cascade_path = default_xml
            else:
                logger.error(f"Haar Cascade XML tidak ditemukan di {self.cascade_path}. Jalankan 'make setup-ai'.")
                self.face_cascade = None
                return

        try:
            self.face_cascade = cv2.CascadeClassifier(self.cascade_path)
            if self.face_cascade.empty():
                logger.error("Gagal memuat Haar Cascade Classifier.")
                self.face_cascade = None
            else:
                logger.info("Haar Cascade Detector berhasil dimuat.")
        except Exception as e:
            logger.error(f"Error inisialisasi Haar Cascade: {e}")
            self.face_cascade = None

    def detect_face(self, image: np.ndarray) -> Optional[Tuple[np.ndarray, Tuple[int, int, int, int]]]:
        """
        Mendeteksi wajah dalam gambar BGR. 
        Returns: (face_crop, (x, y, w, h))
        """
        if self.face_cascade is None or image is None:
            return None

        # Haar Cascade bekerja lebih baik pada grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Deteksi wajah dengan parameter standar
        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )

        if len(faces) == 0:
            return None

        # Ambil wajah terbesar (biasanya wajah utama)
        faces = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)
        (x, y, w, h) = faces[0]
        
        # Berikan sedikit margin (opsional, tapi Haar sering memotong terlalu ketat)
        face_crop = image[y:y+h, x:x+w]

        return face_crop, (x, y, w, h)
