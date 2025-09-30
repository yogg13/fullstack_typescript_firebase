# 🔥 Firebase Configuration Setup Guide

## Langkah-langkah Mendapatkan Firebase Configuration

### 📋 **Step 1: Setup Firebase Project**

1. **Buka Firebase Console**

   ```
   https://console.firebase.google.com/
   ```

2. **Buat Project Baru**
   - Click "Create a project"
   - Project name: `fastify-tutorial-app` (atau nama lain)
   - Enable/disable Google Analytics
   - Choose location: `Asia/Jakarta` atau `Asia/Singapore`

### 📋 **Step 2: Setup Realtime Database**

1. **Aktifkan Realtime Database**

   - Sidebar → "Realtime Database"
   - Click "Create Database"
   - Choose location: `asia-southeast1`
   - Start in **test mode** (untuk development)

2. **Database URL akan menjadi:**
   ```
   https://fastify-tutorial-app-12345-default-rtdb.asia-southeast1.firebasedatabase.app/
   ```

### 📋 **Step 3: Generate Service Account**

1. **Masuk ke Project Settings**

   - Click ⚙️ icon → "Project settings"
   - Tab "Service accounts"
   - Select "Firebase Admin SDK"

2. **Generate Private Key**
   - Language: "Node.js"
   - Click "Generate new private key"
   - Download file JSON

### 📋 **Step 4: Mapping Values ke .env**

**File JSON yang di-download:**

```json
{
  "type": "service_account",
  "project_id": "fastify-tutorial-app-12345",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xyz@fastify-tutorial-app-12345.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

**Mapping ke .env file:**

```bash
# Copy nilai dari JSON file:
FIREBASE_PROJECT_ID=fastify-tutorial-app-12345
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@fastify-tutorial-app-12345.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### 📋 **Step 5: Contoh .env yang Sudah Diisi**

```bash
# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=admin123
DB_NAME=fastify_tutorial

# Fastify Configuration
PORT=3000

# Firebase Configuration
FIREBASE_PROJECT_ID=fastify-tutorial-app-12345
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@fastify-tutorial-app-12345.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7j8QqS5...\n-----END PRIVATE KEY-----\n"
```

## ⚠️ **Penting untuk Diperhatikan:**

### **Security Best Practices:**

1. **Jangan Commit .env ke Git**

   ```bash
   # Pastikan .env ada di .gitignore
   echo ".env" >> .gitignore
   ```

2. **Set Production Database Rules**

   ```json
   {
     "rules": {
       "product_logs": {
         ".read": "auth != null",
         ".write": "auth != null"
       }
     }
   }
   ```

3. **Gunakan Environment-specific Configs**
   - `.env.development`
   - `.env.production`
   - `.env.staging`

### **Testing Connection:**

Setelah setup, test koneksi dengan:

```bash
npm run dev
```

Cek di console apakah muncul:

```
✅ Firebase terhubung dengan sukses
🚀 Server running at http://localhost:3000
```

### **Troubleshooting:**

**Error: "Failed to parse private key"**

- Pastikan private_key di copy lengkap dengan `\n`
- Gunakan double quotes `"` untuk wrap private_key

**Error: "Project not found"**

- Pastikan project_id sesuai dengan yang di Firebase Console
- Check typo pada project_id

**Error: "Permission denied"**

- Pastikan Service Account memiliki role "Firebase Admin"
- Check Database Rules di Firebase Console

## 🧪 **Test Firebase Integration**

Setelah konfigurasi selesai, test dengan API:

```bash
# Test create product (akan otomatis log ke Firebase)
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "Test Product",
  "price": 50000,
  "stock": 10
}
```

Check Firebase Console → Realtime Database → Lihat data di `product_logs`
