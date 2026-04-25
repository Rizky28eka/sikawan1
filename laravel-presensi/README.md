# Sikawan Backend — Laravel API

Sistem backend inti untuk platform presensi Sikawan, dibangun menggunakan **Laravel 11**, **Inertia.js**, dan **React**. Service ini menangani manajemen data, autentikasi, geofencing, dan orkestrasi dengan AI Service.

## 🚀 Fitur Utama
- **Manajemen User & RBAC**: Kontrol akses untuk Owner, Manager, dan Employee.
- **Attendance Engine**: Logika kehadiran dengan validasi Geofencing lokasi site.
- **Holiday Sync**: Sinkronisasi otomatis hari libur nasional Indonesia.
- **Dashboard Analytics**: Visualisasi performa karyawan (Inertia + Recharts).
- **Audit Logs**: Pencatatan jejak aktivitas sistem demi keamanan.

## 🛠️ Tech Stack
- **Framework**: Laravel 11
- **Frontend**: React (via Inertia.js)
- **UI Components**: Shadcn UI + Tailwind CSS
- **Database**: SQLite (Default) / PostgreSQL
- **State Management**: React Hooks & Inertia State

## 📂 Struktur Penting
- `app/Http/Controllers`: Logika bisnis utama (Attendance, Employees, Holidays).
- `app/Models`: Definisi skema database dan relasi.
- `resources/js/Pages`: Komponen UI Dashboard & Analytics.
- `database/seeders`: Data awal untuk departemen, site, dan user testing.

## ⚡ Setup Mandiri
1. **Install Dependencies**:
   ```bash
   composer install
   npm install && npm run dev
   ```
2. **Environment**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
3. **Database**:
   ```bash
   touch database/database.sqlite
   php artisan migrate --seed
   ```
4. **Serve**:
   ```bash
   php artisan serve
   ```

---
**Copyright © 2024 Bilcode Digital Solutions**
# skripsi
