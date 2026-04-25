import sys
import os

# Add parent directory to path to allow importing src
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging
from src.services.training_service import TrainingService

logging.basicConfig(level=logging.INFO)

if __name__ == '__main__':
    print("Mengeksekusi TrainingService...")
    ts = TrainingService()
    results = ts.retrain()
    print("Hasil Training:", results)
    if not results.get("success", True): # Assume success mapping or dict response
        if "success" in results and not results["success"]:
            sys.exit(1)
