#Tampilan utama
<<<<<<< Updated upstream
![Tampilan Barang](screenshot/barang.png)
![Tampilan penjualan](screenshot/penjualan.png)
![Tampilan pelanggan](screenshot/pelanggan.png)

# 🖥️ Frontend - Inventori CRUD

Aplikasi web untuk mengelola barang, penjualan, dan pelanggan menggunakan **Next.js** dan **Tailwind CSS**.

## 🔧 Fitur

- CRUD Barang
- CRUD Penjualan (dengan item)
- CRUD Pelanggan
- Pagination
- Modal form
- Responsive (bisa di desktop & tablet)

## ▶️ Cara Jalankan

````bash
cd frontend
npm install
cp .env.local.example .env.local  # Edit URL backend
npm run dev

## ✅ **2. README Backend (Sederhana)**
**Lokasi:** `inventori-crud/backend/README.md`

```md
# 🖥️ Backend - Inventori CRUD

API Laravel untuk manajemen inventaris: barang, pelanggan, dan penjualan.

## 🔧 Fitur
- CRUD Barang: nama, kategori, harga
- CRUD Pelanggan: nama, domisili, jenis kelamin
- CRUD Penjualan: relasi dengan pelanggan & barang
- Pagination & validasi data
- Response JSON rapi

## ▶️ Cara Jalankan
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

````
