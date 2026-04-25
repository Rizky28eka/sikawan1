# ==============================================================================
# Sikawan2 — Unified Project Makefile (Full Alignment)
# ==============================================================================

# Directories
AI  := skripsi-presensi-ai
LAR := laravel-presensi

# Helpers
PYTHON  := $(AI)/venv/bin/python
PIP     := $(AI)/venv/bin/pip
ARTISAN := php $(LAR)/artisan

# Colors
C_CYAN   := \033[1;36m
C_GREEN  := \033[1;32m
C_YELLOW := \033[1;33m
C_BLUE   := \033[1;34m
C_RED    := \033[1;31m
C_RESET  := \033[0m

.PHONY: help env install dev run-ai run-lar seed retrain train-ai logs lint test clean clear reset docker-up docker-down

help: ## Menampilkan menu bantuan ini
	@echo "$(C_CYAN)Sikawan2 Unified Command Center$(C_RESET)"
	@echo "--------------------------------------------------------------"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(C_GREEN)%-15s$(C_RESET) %s\n", $$1, $$2}'
	@echo "--------------------------------------------------------------"

# --- Environment & Setup ---
env: ## Pastikan file .env tersedia untuk semua service
	@echo "$(C_BLUE)→ Memeriksa file environment...$(C_RESET)"
	@[ -f $(LAR)/.env ] || cp $(LAR)/.env.example $(LAR)/.env
	@[ -f $(AI)/.env ] || cp $(AI)/.env.example $(AI)/.env

install: env ## Install seluruh dependensi (Laravel + AI) dan inisialisasi awal
	@echo "$(C_BLUE)→ Menginstall dependensi proyek...$(C_RESET)"
	cd $(LAR) && composer install && npm install
	$(ARTISAN) key:generate --ansi
	python3 -m venv $(AI)/venv
	$(PIP) install --upgrade pip cmake
	$(PIP) install "setuptools<70"
	$(PIP) install -r $(AI)/requirements.txt
	@mkdir -p $(AI)/models
	$(PYTHON) $(AI)/scripts/download_models.py
	$(MAKE) seed


# --- Development ---
dev: env ## Jalankan seluruh ekosistem (AI + Larvel Server + Queue + Vite)
	@echo "$(C_YELLOW)→ Memulai layanan development (Microservices)...$(C_RESET)"
	@cd $(LAR) && ./node_modules/.bin/concurrently \
		--names "AI,SERVER,QUEUE,VITE" \
		--prefix-colors "blue,green,red,cyan" \
		--kill-others \
		"cd ../$(AI) && venv/bin/uvicorn src.main:app --host 0.0.0.0 --port 8088 --reload" \
		"php artisan serve --host=0.0.0.0" \
		"php artisan queue:listen --tries=1" \
		"npm run dev"

run-ai: ## Jalankan AI Service saja (Port 8088)
	cd $(AI) && venv/bin/uvicorn src.main:app --reload --port 8088

run-lar: ## Jalankan server Laravel saja (Port 8000)
	$(ARTISAN) serve

# --- Database & AI Data ---
seed: ## Migrasi fresh, seeder, dan pembuatan dataset AI sintetis
	@echo "$(C_YELLOW)→ Me-refresh database dan data AI...$(C_RESET)"
	$(ARTISAN) migrate:fresh --seed
	$(MAKE) retrain train-ai

retrain: ## Membuat ulang dataset wajah sintetis untuk AI
	$(PYTHON) $(AI)/scripts/generate_synthetic_dataset.py --users 50 --augments 100

train-ai: ## Melatih ulang model KNN wajah
	$(PYTHON) $(AI)/scripts/train_model.py

# --- Maintenance & Quality ---
logs: ## Pantau log Laravel dan AI Service secara real-time
	@echo "$(C_BLUE)→ Memantau logs...$(C_RESET)"
	@tail -f $(LAR)/storage/logs/laravel.log $(AI)/server.log 2>/dev/null || echo "File log belum tersedia."

lint: ## Jalankan analisis kode statis (PHPStan & Ruff)
	cd $(LAR) && ./vendor/bin/phpstan analyse
	$(AI)/venv/bin/ruff check $(AI)/src --fix

test: ## Jalankan seluruh pengujian unit dan fitur
	$(ARTISAN) test
	$(PYTHON) $(AI)/scripts/test_service_full.py

clean: ## Hapus logs, dataset sementara, model, dan cache
	@echo "$(C_RED)→ Membersihkan artefak proyek...$(C_RESET)"
	@rm -f $(LAR)/storage/logs/*.log $(AI)/server.log $(AI)/models/*.joblib 2>/dev/null || true
	@rm -rf $(AI)/dataset/train/* $(AI)/dataset/test/* 2>/dev/null || true
	@find $(AI)/dataset/train -mindepth 1 -maxdepth 1 -type d -exec rm -rf {} + 2>/dev/null || true
	@find $(AI)/dataset/test -mindepth 1 -maxdepth 1 -type d -exec rm -rf {} + 2>/dev/null || true
	@cd $(LAR) && php artisan view:clear && php artisan cache:clear
	@echo "$(C_GREEN)✔ Pembersihan selesai.$(C_RESET)"

reset: clean install ## Reset total sistem (Clean -> Install -> Seed)

# --- Docker ---
docker-up: ## Jalankan menggunakan Docker Compose
	docker-compose up -d

docker-down: ## Hentikan dan hapus kontainer Docker
	docker-compose down