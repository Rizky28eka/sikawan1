import os
import json
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8088
    
    # Base directory of the project (skripsi-presensi-ai/)
    base_path: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    @property
    def model_dir(self) -> str:
        return os.path.join(self.base_path, "models")
        
    @property
    def dataset_dir(self) -> str:
        return os.path.join(self.base_path, "dataset")
    
    # Threshold dlib (0.6 is common)
    recognition_threshold: float = 0.6
    confidence_threshold: float = 45.0
    augmentation_count: int = 50
    
    cors_origins: str = '["*"]'

    @property
    def allowed_origins(self) -> List[str]:
        try:
            return json.loads(self.cors_origins)
        except:
            return ["*"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
