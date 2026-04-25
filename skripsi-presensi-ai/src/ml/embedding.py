import cv2
import numpy as np
import logging
import face_recognition
from typing import Optional, List, Tuple
from src.core.config import settings

logger = logging.getLogger(__name__)

class FeatureExtractor:
    """
    Ekstraksi fitur wajah (embedding 128D) menggunakan library face_recognition.
    Input: Gambar BGR dan Bounding Box hasil Haar Cascade.
    """
    def extract_embedding(self, image: np.ndarray, bbox: Optional[Tuple[int, int, int, int]] = None) -> Optional[np.ndarray]:
        """
        Input: BGR Image.
        Bbox: (x, y, w, h)
        """
        if image is None:
            return None

        try:
            # face_recognition menggunakan format RGB
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            face_locations = None
            if bbox:
                # Konversi (x, y, w, h) ke (top, right, bottom, left)
                x, y, w, h = bbox
                face_locations = [(y, x + w, y + h, x)]
            
            # Ekstrak encoding (128-d vector)
            # Karena sudah ada box dari Haar, kita bisa langsung tunjuk lokasinya
            encodings = face_recognition.face_encodings(image_rgb, known_face_locations=face_locations)
            
            if not encodings:
                # Jika box Haar gagal divalidasi oleh dlib, coba cari ulang otomatis
                if not bbox:
                    encodings = face_recognition.face_encodings(image_rgb)
                
            if encodings:
                # Return encoding pertama
                return np.array(encodings[0], dtype=np.float32)
            
            return None
        except Exception as e:
            logger.warning(f"Gagal mengekstrak embedding via face_recognition: {e}")
            return None

    def compare_faces(self, emb1: np.ndarray, emb2: np.ndarray) -> Tuple[bool, float]:
        """Bandingkan dua wajah secara langsung (verifikasi 1-ke-1)."""
        # face_recognition.compare_faces mengembalikkan bool
        # Kita hitung manual jaraknya agar dapat distance & confidence
        distance = np.linalg.norm(emb1 - emb2)
        match = distance <= settings.recognition_threshold
        return bool(match), float(distance)
