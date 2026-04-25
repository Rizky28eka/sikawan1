import logging
import math
import os
import joblib
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
from typing import Dict, List, Optional, Tuple, Any
from src.core.config import settings

logger = logging.getLogger(__name__)

class KNNTrainer:
    """
    Melatih klasifikasi KNN berbasis dlib 128D embeddings.
    """
    def __init__(self, models_dir: Optional[str] = None):
        self.models_dir = models_dir or settings.model_dir
        os.makedirs(self.models_dir, exist_ok=True)
        self.model_path = os.path.join(self.models_dir, "knn_model.joblib")

    def train(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        """
        Input: 
            X: Matrix of 128D embeddings
            y: List of user_ids
        """
        if len(X) == 0:
            return {"status": "error", "message": "No data for training"}

        # Otomatis tentukan k (biasanya sqrt(N))
        n_samples = len(X)
        k = int(math.sqrt(n_samples))
        if k % 2 == 0: k += 1 # Ganjil lebih baik
        k = max(3, min(k, 49)) # Clamp range (Increased for V5 accuracy)

        # KNN dengan Euclidean Distance (Default untuk embeddings)
        knn = KNeighborsClassifier(
            n_neighbors=k,
            weights='distance',
            metric='euclidean'
        )
        
        knn.fit(X, y)
        
        # Simpan menggunakan joblib sesuai permintaan user
        joblib.dump(knn, self.model_path)
        
        # Simpan metadata class names
        class_names = sorted(list(set(y)))
        metadata_path = os.path.join(self.models_dir, "metadata.joblib")
        joblib.dump(class_names, metadata_path)
        
        logger.info(f"Model KNN dilatih dengan {n_samples} sampel, k={k}")
        
        return {
            "status": "success",
            "k_value": k,
            "n_samples": n_samples,
            "n_classes": len(class_names)
        }

    def load_model(self) -> Tuple[Optional[KNeighborsClassifier], List[str]]:
        if not os.path.exists(self.model_path):
            return None, []
        
        try:
            knn = joblib.load(self.model_path)
            metadata_path = os.path.join(self.models_dir, "metadata.joblib")
            class_names = joblib.load(metadata_path) if os.path.exists(metadata_path) else []
            return knn, class_names
        except Exception as e:
            logger.error(f"Gagal memuat model joblib: {e}")
            return None, []
