FROM python:3.10-slim

# 1. Set working directory
WORKDIR /app

# 2. Install library OS yang dibutuhkan OpenCV dan build tools
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# 3. Copy file requirements dan install dependensi
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy seluruh kode Python AI
COPY . .

# 5. Expose port 8088 (sesuai Makefile kamu)
EXPOSE 8088

# 6. Jalankan Uvicorn
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8088"]