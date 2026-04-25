import os
import cv2
import shutil
import logging
import numpy as np
from typing import List, Tuple, Dict, Optional
from src.core.config import settings

logger = logging.getLogger(__name__)

class FaceRepository:
    """
    DAL (Data Access Layer) untuk penyimpanan dataset wajah.
    Struktur: dataset/train/user_id/image.png
    """
    def __init__(self, base_dir: Optional[str] = None):
        self.base_dir = base_dir or settings.dataset_dir
        self.train_dir = os.path.join(self.base_dir, "train")
        self.test_dir = os.path.join(self.base_dir, "test")
        
        for d in [self.train_dir, self.test_dir]:
            os.makedirs(d, exist_ok=True)

    def save_images(self, user_id: str, images: List[np.ndarray], is_test: bool = False):
        target_root = self.test_dir if is_test else self.train_dir
        user_dir = os.path.join(target_root, user_id)
        os.makedirs(user_dir, exist_ok=True)
        
        for i, img in enumerate(images):
            # Simpan file gambar asli untuk audit/retraining
            filename = f"{user_id}_{i}.png"
            cv2.imwrite(os.path.join(user_dir, filename), img)

    def save_embedding(self, user_id: str, index: int, embedding: np.ndarray):
        """Simpan embedding ke disk untuk cache training."""
        user_dir = os.path.join(self.train_dir, user_id)
        os.makedirs(user_dir, exist_ok=True)
        filename = f"{user_id}_{index}.npy"
        np.save(os.path.join(user_dir, filename), embedding)

    def load_embedding(self, image_path: str) -> Optional[np.ndarray]:
        """Load embedding jika ada (cache)."""
        emb_path = image_path.rsplit('.', 1)[0] + ".npy"
        if os.path.exists(emb_path):
            try:
                return np.load(emb_path)
            except:
                return None
        return None

    def load_dataset(self) -> Tuple[List[str], List[str]]:
        """Mengembalikan list path gambar dan list label."""
        image_paths = []
        labels = []
        
        if not os.path.exists(self.train_dir):
            return [], []
            
        for user_id in sorted(os.listdir(self.train_dir)):
            user_dir = os.path.join(self.train_dir, user_id)
            if not os.path.isdir(user_dir): continue
            
            for fname in os.listdir(user_dir):
                if fname.lower().endswith(('.png', '.jpg', '.jpeg')):
                    image_paths.append(os.path.join(user_dir, fname))
                    labels.append(user_id)
                    
        return image_paths, labels

    def delete_user(self, user_id: str):
        for base in [self.train_dir, self.test_dir]:
            path = os.path.join(base, user_id)
            if os.path.exists(path):
                shutil.rmtree(path)

    def get_all_embeddings(self) -> List[Tuple[str, np.ndarray]]:
        """Mengambil semua embedding yang tersimpan beserta label user_id-nya untuk pengecekan konflik."""
        results = []
        if not os.path.exists(self.train_dir):
            return []
            
        for user_id in os.listdir(self.train_dir):
            user_dir = os.path.join(self.train_dir, user_id)
            if not os.path.isdir(user_dir):
                continue
                
            for fname in os.listdir(user_dir):
                if fname.endswith(".npy"):
                    emb_path = os.path.join(user_dir, fname)
                    try:
                        emb = np.load(emb_path)
                        results.append((user_id, emb))
                    except Exception as e:
                        logger.warning(f"Error loading embedding {emb_path}: {e}")
        return results
