import os
import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Downloader")

MODELS = {
    "face_detection_yunet_2023mar.onnx": "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx",
    "face_recognition_sface_2021dec.onnx": "https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx",
    "haarcascade_frontalface_default.xml": "https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml"
}

def download_models():
    # Mendapatkan path absolut ke direktori skrip ini
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Naik satu level ke skripsi-presensi-ai/ lalu masuk ke models/
    model_dir = os.path.join(os.path.dirname(script_dir), "models")
    
    os.makedirs(model_dir, exist_ok=True)
    
    for name, url in MODELS.items():
        path = os.path.join(model_dir, name)
        if os.path.exists(path):
            logger.info(f"Model {name} sudah ada, melewati unduhan.")
            continue
            
        logger.info(f"Mengunduh {name}...")
        try:
            resp = requests.get(url, stream=True)
            resp.raise_for_status()
            with open(path, "wb") as f:
                for chunk in resp.iter_content(chunk_size=8192):
                    f.write(chunk)
            logger.info(f"Berhasil mengunduh {name}")
        except Exception as e:
            logger.error(f"Gagal mengunduh {name}: {e}")

if __name__ == "__main__":
    download_models()

