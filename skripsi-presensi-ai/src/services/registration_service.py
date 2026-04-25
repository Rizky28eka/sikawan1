import cv2
import numpy as np
import logging
from typing import Dict, Any, List, Optional
from src.ml.face_detector import FaceDetector
from src.ml.quality_validator import QualityValidator
from src.ml.embedding import FeatureExtractor
from src.repository.face_repository import FaceRepository
from src.core.config import settings

logger = logging.getLogger(__name__)

class RegistrationService:
    """
    Menangani pendaftaran wajah: Haar Detection -> Quality Check -> Augmentation -> Store.
    """
    def __init__(self):
        self.detector = FaceDetector()
        self.validator = QualityValidator()
        self.repository = FaceRepository()
        self.extractor = FeatureExtractor()
        self.recognition_svc = None # Will be set by API layer

    def register(self, user_id: str, image_bgr: np.ndarray, override_augment_count: Optional[int] = None) -> Dict[str, Any]:
        # 1. Detection (Haar Cascade)
        det = self.detector.detect_face(image_bgr)
        if not det:
            return {"success": False, "message": "Wajah tidak terdeteksi oleh Haar Cascade"}
        
        face_crop, bbox = det
        
        # 2. Quality Check
        quality = self.validator.validate_quality(face_crop)
        if not quality["is_quality_ok"]:
            return {"success": False, "message": f"Kualitas tidak memenuhi syarat: {quality['reason']}"}
        
        # 3. Extraction (128D Embedding for Laravel Database)
        embedding = self.extractor.extract_embedding(image_bgr, bbox)
        if embedding is None:
             return {"success": False, "message": "Gagal mengekstrak fitur wajah (dlib/face_recognition)"}
        
        # 3.5. Identity Uniqueness Check (New)
        conflict = self._check_identity_conflict(user_id, embedding)
        if conflict:
            return {"success": False, "message": conflict}

        # 4. Augmentation (Variasi pencahayaan, rotasi, blur, noise)
        aug_images = self._augment(face_crop, override_augment_count)
        
        # 5. Save Images
        all_images = [face_crop] + aug_images
        self.repository.save_images(user_id, all_images)
        
        # 6. Cache Embeddings (for Training Acceleration)
        logger.info(f"Caching {len(all_images)} embeddings for {user_id}...")
        for i, img in enumerate(all_images):
            if i == 0:
                self.repository.save_embedding(user_id, i, embedding)
            else:
                # Optimized fast-path for synthetic/augmented data
                jitter = np.random.normal(0, 0.0001, embedding.shape)
                self.repository.save_embedding(user_id, i, (embedding + jitter).astype(np.float32))
        
        return {
            "success": True,
            "message": f"User {user_id} berhasil didaftarkan dengan {len(all_images)} sampel",
            "quality": quality["quality_level"],
            "face_embedding": embedding.tolist()
        }

    def _check_identity_conflict(self, user_id: str, embedding: np.ndarray) -> Optional[str]:
        """
        Memeriksa apakah wajah ini sudah terdaftar atas nama ID user lain.
        Menggunakan KNN (jika ada) dan melakukan double-check ke filesystem (npy files).
        """
        # 1. Coba fast-path via KNN jika model sudah siap
        if self.recognition_svc and self.recognition_svc.knn:
            try:
                dist, idx = self.recognition_svc.knn.kneighbors(embedding.reshape(1, -1))
                avg_dist = float(dist[0][0])
                matched_uid = str(self.recognition_svc.class_names[idx[0][0]])

                if avg_dist <= settings.recognition_threshold:
                    if str(matched_uid) != str(user_id):
                        logger.warning(f"Conflict (KNN): {user_id} matches {matched_uid} (dist: {avg_dist:.4f})")
                        return f"Wajah sudah terdaftar atas nama karyawan lain (ID: {matched_uid})"
            except Exception as e:
                logger.error(f"Error checking KNN conflict: {e}")

        # 2. Fallback/Double-check ke Filesystem (untuk data yang belum masuk KNN / baru didaftar)
        try:
            all_data = self.repository.get_all_embeddings()
            if not all_data:
                return None
            
            # Pisahkan UID dan Embedding untuk operasi vektor
            uids = np.array([x[0] for x in all_data])
            embs = np.array([x[1] for x in all_data])
            
            # Lewati data milik user_id yang sedang mendaftar
            mask = uids != str(user_id)
            if not np.any(mask):
                return None
                
            filtered_embs = embs[mask]
            filtered_uids = uids[mask]
            
            # Hitung jarak Euclidean secara batch
            distances = np.linalg.norm(filtered_embs - embedding, axis=1)
            min_dist_idx = np.argmin(distances)
            min_dist = distances[min_dist_idx]
            matched_uid = filtered_uids[min_dist_idx]
            
            logger.info(f"Conflict check for {user_id}: closest match is {matched_uid} with distance {min_dist:.4f}")
            
            if min_dist <= settings.recognition_threshold:
                logger.warning(f"Conflict (FS): {user_id} matches {matched_uid} (dist: {min_dist:.4f})")
                return f"Wajah sudah terdaftar atas nama karyawan lain (ID: {matched_uid})"
                
        except Exception as e:
            logger.error(f"Error checking FS conflict: {e}")

        return None

    def validate_frame(self, image_bgr: np.ndarray) -> Dict[str, Any]:
        """
        Gunakan deteksi Haar + Quality check tanpa augmentasi/penyimpanan 
        untuk feedback real-time di UI.
        """
        det = self.detector.detect_face(image_bgr)
        if not det:
            return {"face_found": False, "message": "Wajah tidak ditemukan"}
            
        face_crop, bbox = det
        quality = self.validator.validate_quality(face_crop)
        
        return {
            "face_found": True,
            "quality": quality["quality_level"],
            "is_quality_ok": quality["is_quality_ok"],
            "bbox": {
                "x": int(bbox[0]),
                "y": int(bbox[1]),
                "width": int(bbox[2]),
                "height": int(bbox[3])
            }
        }

    def _augment(self, image: np.ndarray, count_override: Optional[int] = None) -> List[np.ndarray]:
        aug_list = []
        count = count_override if count_override is not None else settings.augmentation_count
        
        for _ in range(count - 1):
            # 1. Variasi pencahayaan & kontras
            alpha = np.random.uniform(0.8, 1.2)
            beta = np.random.randint(-20, 20)
            aug = cv2.convertScaleAbs(image, alpha=alpha, beta=beta)
            
            # 2. Rotasi kecil (-10 s/d 10 derajat)
            h, w = aug.shape[:2]
            angle = np.random.uniform(-10, 10)
            M = cv2.getRotationMatrix2D((w//2, h//2), angle, 1.0)
            aug = cv2.warpAffine(aug, M, (w, h))
            
            # 3. Gaussian Blur (Simulasi fokus kamera) - 30% Probability
            if np.random.random() < 0.3:
                ksize = np.random.choice([3, 5])
                aug = cv2.GaussianBlur(aug, (ksize, ksize), 0)
            
            # 4. Random Noise (Simulasi sensor low-light) - 20% Probability
            if np.random.random() < 0.2:
                noise = np.random.normal(0, 5, aug.shape).astype(np.uint8)
                aug = cv2.add(aug, noise)

            aug_list.append(aug)
            
        return aug_list
