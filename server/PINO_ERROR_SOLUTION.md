# 🔧 Solusi Error Pino-Pretty

## Masalah

Error: `unable to determine transport target for "pino-pretty"`

## Penyebab

1. `pino-pretty` dependency tidak terinstall dengan benar
2. Konflik versi antara `pino` dan `pino-pretty`
3. Module resolution issue di environment tertentu

## ✅ Solusi yang Diterapkan

### 1. **Custom Logger Fallback**

Dibuat custom logger sederhana di `src/utils/logger.ts` yang:

- Memberikan colored output untuk development
- Tidak bergantung pada `pino-pretty`
- Kompatibel dengan semua environment

### 2. **Simplified Fastify Logger**

```typescript
// Menggunakan basic pino logger tanpa transport
const fastify = Fastify({
  logger: {
    level: "info",
  },
});
```

### 3. **Enhanced Startup Messages**

- Menggunakan custom logger untuk startup messages
- Clear status indicators (✅, ⚠️, 🚀)
- Better error handling dan debugging info

## 🚀 Cara Menjalankan

### Option 1: Dengan Setup Script

```bash
# Jalankan setup dependencies
.\setup-dependencies.bat

# Kemudian start server
npm run dev
```

### Option 2: Manual

```bash
# Install dependencies
npm install

# Install pino-pretty (optional)
npm install pino-pretty --save-dev

# Start server
npm run dev
```

## 📊 Expected Output Setelah Fix

Server akan menampilkan output seperti ini:

```
[2025-09-29 10:30:00] INFO: 🚀 Starting Fastify MySQL Firebase Tutorial Server...
[2025-09-29 10:30:01] INFO: 📊 Testing database connection...
[2025-09-29 10:30:01] SUCCESS: ✅ Database connected successfully
[2025-09-29 10:30:02] INFO: 🔥 Testing Firebase connection...
[2025-09-29 10:30:02] SUCCESS: ✅ Firebase connected successfully
[2025-09-29 10:30:03] SUCCESS: 🚀 Server running at http://localhost:3000
[2025-09-29 10:30:03] INFO: 📊 Health check: http://localhost:3000/health
[2025-09-29 10:30:03] INFO: 🛍️ Products API: http://localhost:3000/api/products
```

## 🔍 Troubleshooting

### Jika Masih Error:

1. **Clear npm cache:**

   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules dan reinstall:**

   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

3. **Check Node.js version:**
   ```bash
   node --version  # Pastikan >= 16.0.0
   ```

### Database Error:

Jika muncul error database setelah logger fixed:

```bash
# Buat database MySQL
mysql -u root -p -P 3309 < database.sql
```

## ✨ Benefits dari Solusi Ini

1. **Robust**: Tidak bergantung pada external pretty printer
2. **Fast**: Startup lebih cepat tanpa overhead pino-pretty
3. **Clear**: Output yang lebih mudah dibaca dengan colors
4. **Flexible**: Fallback otomatis jika ada masalah
5. **Production Ready**: Simple JSON logging untuk production
