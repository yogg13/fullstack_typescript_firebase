# Tutorial Fastify + MySQL + Firebase

## Ringkasan Proyek

Proyek ini adalah tutorial lengkap untuk membuat REST API CRUD sederhana menggunakan:

- **Fastify** sebagai web framework
- **MySQL** sebagai database utama
- **Firebase** untuk logging dan notifikasi real-time

## Struktur Folder

```
server/
├── src/
│   ├── config/
│   │   ├── database.ts      # Konfigurasi MySQL
│   │   └── firebase.ts      # Konfigurasi Firebase
│   ├── types/
│   │   └── product.ts       # Interface TypeScript
│   ├── services/
│   │   └── productService.ts # Business logic
│   ├── routes/
│   │   └── productRoutes.ts # API endpoints
│   └── server.ts            # Main server file
├── package.json
├── tsconfig.json
├── database.sql             # Schema database
└── .env.example            # Template environment
```

## Persiapan Sebelum Memulai

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup Database MySQL

1. Buat database baru di MySQL
2. Jalankan script `database.sql` untuk membuat tabel dan data sample
3. Copy `.env.example` menjadi `.env` dan sesuaikan konfigurasi

### 3. Setup Firebase

1. Buat project di Firebase Console
2. Enable Realtime Database atau Firestore
3. Generate Service Account Key
4. Masukkan kredensial ke file `.env`

### 4. Konfigurasi Environment (.env)

```env
# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fastify_tutorial

# Fastify Configuration
PORT=3000

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
```

## Cara Menjalankan

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## Endpoint API

| Method | URL                 | Deskripsi                         |
| ------ | ------------------- | --------------------------------- |
| GET    | `/health`           | Health check server               |
| GET    | `/api/products`     | Mendapatkan semua produk          |
| GET    | `/api/products/:id` | Mendapatkan produk berdasarkan ID |
| POST   | `/api/products`     | Membuat produk baru               |
| PUT    | `/api/products/:id` | Memperbarui produk                |
| DELETE | `/api/products/:id` | Menghapus produk                  |

## Contoh Penggunaan

### 1. Membuat Produk Baru

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone Samsung",
    "price": 5000000,
    "stock": 20
  }'
```

### 2. Mendapatkan Semua Produk

```bash
curl http://localhost:3000/api/products
```

### 3. Memperbarui Produk

```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 4500000,
    "stock": 15
  }'
```

### 4. Menghapus Produk

```bash
curl -X DELETE http://localhost:3000/api/products/1
```

## Integrasi Firebase

Setiap operasi CUD (Create, Update, Delete) akan secara otomatis mengirim log ke Firebase Realtime Database dengan format:

```json
{
  "action": "CREATE_PRODUCT",
  "productId": 123,
  "productName": "Smartphone Samsung",
  "timestamp": "2025-09-26T17:00:00Z"
}
```

Log dapat dilihat di Firebase Console > Realtime Database > `product_logs`

## Fitur Utama

1. **Type Safety**: Menggunakan TypeScript untuk type safety
2. **Validation**: Validasi input menggunakan JSON Schema Fastify
3. **Connection Pooling**: Menggunakan connection pool MySQL untuk performa
4. **Error Handling**: Comprehensive error handling
5. **Logging**: Integration dengan Firebase untuk audit trail
6. **Graceful Shutdown**: Proper server shutdown handling

## Troubleshooting

### Error Database Connection

- Pastikan MySQL server berjalan
- Periksa kredensial di file `.env`
- Pastikan database sudah dibuat

### Error Firebase Connection

- Periksa Firebase project ID
- Pastikan Service Account Key valid
- Periksa format private key (harus include \\n untuk newline)

### Error Dependencies

- Jalankan `npm install` untuk memastikan semua dependencies terinstall
- Periksa versi Node.js (minimal 16.x)

## Next Steps

Setelah menguasai dasar-dasar ini, Anda bisa mengembangkan:

1. Authentication dan Authorization
2. Pagination dan Filtering
3. File Upload
4. Real-time notifications
5. Testing (Unit & Integration)
6. Docker containerization
