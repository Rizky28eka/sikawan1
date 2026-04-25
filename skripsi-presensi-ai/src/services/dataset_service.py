import os
import cv2
import aiohttp
import asyncio
import logging
import numpy as np
from typing import Dict, Any, List
from src.repository.face_repository import FaceRepository

logger = logging.getLogger(__name__)

class DatasetService:
    """
    Mengelola pembuatan dataset sintetis untuk eksperimen skripsi.
    """
    def __init__(self):
        self.repository = FaceRepository()
        self.synth_api = "https://thispersondoesnotexist.com/"

    async def generate_synthetic_dataset(self, num_users: int, augment_count: int, max_concurrent: int = 1) -> Dict[str, Any]:
        logger.info(f"Generating {num_users} synth users for skripsi experiment (concurrency: {max_concurrent})...")
        
        results = []
        semaphore = asyncio.Semaphore(max_concurrent)
        
        async with aiohttp.ClientSession() as session:
            tasks = []
            for i in range(num_users):
                user_id = f"skripsi_synth_{i+1:03d}"
                tasks.append(self._process_single_synth_user(session, semaphore, user_id, augment_count))
            
            # Execute one by one with progress visualization
            total = len(tasks)
            if max_concurrent == 1:
                for idx, task in enumerate(tasks):
                    print(f"🔄 [{idx+1}/{total}] Memproses {f'skripsi_synth_{idx+1:03d}'}...", end="\r", flush=True)
                    res = await task
                    results.append(res)
                    # Add a small delay between different users to ensure new identity from API
                    await asyncio.sleep(1.5)
                print(f"\n✨ Selesai memproses {total} user.")
            else:
                results = await asyncio.gather(*tasks)
            
        success_count = sum(1 for r in results if r["status"] == "success")
        
        return {
            "status": "success",
            "users_generated": success_count,
            "details": results
        }

    async def _process_single_synth_user(self, session, semaphore, user_id, augment_count) -> Dict[str, Any]:
        async with semaphore:
            max_retries = 10 # Increased retries
            for attempt in range(max_retries):
                try:
                    # 1. Download image with robust cache-busting
                    import random
                    cache_buster = random.getrandbits(32)
                    url = f"{self.synth_api}?v={cache_buster}"
                    
                    # Rotate User-Agents to prevent being served the same image
                    user_agents = [
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1"
                    ]
                    headers = {"User-Agent": random.choice(user_agents)}
                    
                    # Longer delay for retries to allow remote service to cycle its generator
                    if attempt > 0:
                        wait_time = attempt * 3
                        logger.info(f"Waiting {wait_time}s before retry {attempt+1} for {user_id}...")
                        await asyncio.sleep(wait_time)
                    
                    async with session.get(url, timeout=20, headers=headers) as resp:
                        if resp.status != 200: 
                            if attempt < max_retries - 1: continue
                            return {"user_id": user_id, "status": "error", "message": f"HTTP {resp.status}"}
                        data = await resp.read()
                        
                    nparr = np.frombuffer(data, np.uint8)
                    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                    
                    if img is None:
                        if attempt < max_retries - 1: continue
                        return {"user_id": user_id, "status": "error", "message": "Gagal mendecode gambar"}

                    # 2. Augment (using simple registration logic)
                    from src.services.registration_service import RegistrationService
                    reg_svc = RegistrationService()
                    
                    # Biarkan RegistrationService menangani deteksi Haar & simpan
                    res = reg_svc.register(user_id, img, override_augment_count=augment_count)
                    
                    if res["success"]:
                        return {"user_id": user_id, "status": "success", "images_saved": augment_count}
                    else:
                        # Check if failure is due to conflict
                        msg = res.get("message", "")
                        if "Conflict" in msg or "sudah terdaftar" in msg:
                            logger.warning(f"Retry {attempt+1}/{max_retries} for {user_id} due to conflict: {msg}")
                            if attempt < max_retries - 1:
                                continue # Retry loop
                        
                        return {"user_id": user_id, "status": "error", "message": msg}
                except Exception as e:
                    if attempt < max_retries - 1:
                        logger.error(f"Error on attempt {attempt+1} for {user_id}: {str(e)}. Retrying...")
                        await asyncio.sleep(2)
                        continue
                    return {"user_id": user_id, "status": "error", "message": str(e)}
            
            return {"user_id": user_id, "status": "error", "message": "Max retries reached"}
