import argparse
import asyncio
import sys
import os

# Add root directory to path to allow importing src
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.services.dataset_service import DatasetService
from src.core.config import settings

async def main():
    parser = argparse.ArgumentParser(description="Generate synthetic face dataset for KNN training.")
    parser.add_argument("--users", type=int, default=10, help="Number of synthetic users to generate")
    parser.add_argument("--augments", type=int, default=settings.augmentation_count, help="Total samples per user")
    
    args = parser.parse_args()
    
    print(f"🚀 Memulai pembuatan dataset sintetis untuk {args.users} user...")
    print(f"⚙️  Setting Augmentasi: {args.augments} per user (dari .env)")
    service = DatasetService()
    
    result = await service.generate_synthetic_dataset(num_users=args.users, augment_count=args.augments)
    
    if result["status"] == "success":
        print(f"✅ Berhasil men-generate {result['users_generated']} user sintetis.")
        # Trigger training automatically after generation
        from src.services.training_service import TrainingService
        print("🔄 Memulai proses training model KNN...")
        train_res = TrainingService().retrain()
        print(f"📈 Hasil Training: {train_res}")
    else:
        print(f"❌ Gagal: {result.get('message', 'Unknown error')}")
    
if __name__ == "__main__":
    asyncio.run(main())
