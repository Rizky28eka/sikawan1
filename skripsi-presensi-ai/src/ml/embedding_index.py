import os
import logging
import numpy as np
from typing import Optional, List
from src.core.config import settings

logger = logging.getLogger(__name__)

class EmbeddingIndex:
    """
    Indeks untuk deteksi duplikat cepat lintas user.
    """
    def __init__(self, index_path: str = "models/embeddings_index.npz"):
        self.index_path = index_path
        self._embeddings: Optional[np.ndarray] = None
        self._user_ids: Optional[np.ndarray] = None

    def save(self):
        if self._embeddings is None: return
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        np.savez_compressed(self.index_path, embeddings=self._embeddings, user_ids=self._user_ids)

    def load(self) -> bool:
        if not os.path.exists(self.index_path): return False
        try:
            data = np.load(self.index_path, allow_pickle=True)
            self._embeddings = data["embeddings"]
            self._user_ids = data["user_ids"]
            return True
        except: return False

    def add(self, user_id: str, embedding: np.ndarray):
        emb = embedding.reshape(1, -1)
        if self._embeddings is None:
            self._embeddings = emb
            self._user_ids = np.array([user_id])
        else:
            self._embeddings = np.vstack([self._embeddings, emb])
            self._user_ids = np.append(self._user_ids, user_id)

    def find_duplicate(self, embedding: np.ndarray, exclude_user_id: str) -> Optional[str]:
        if self._embeddings is None: return None
        
        # Jarak L2 (Euclidean)
        diffs = self._embeddings - embedding
        dists = np.linalg.norm(diffs, axis=1)
        
        mask = self._user_ids != exclude_user_id
        if not np.any(mask): return None
        
        other_dists = dists[mask]
        other_users = self._user_ids[mask]
        
        min_idx = np.argmin(other_dists)
        min_dist = other_dists[min_idx]
        
        if min_dist <= settings.recognition_threshold:
            return str(other_users[min_idx])
        return None
