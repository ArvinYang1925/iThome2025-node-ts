import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// 解析環境變數中的 JSON 字串
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

// 初始化 Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

// 取得 Storage Bucket
const bucket = admin.storage().bucket();

export { admin, bucket };
