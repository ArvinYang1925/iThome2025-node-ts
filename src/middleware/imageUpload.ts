import multer from "multer";
import path from "path";
import { Request } from "express";
import { Express } from "express";

// 使用記憶體儲存（不寫入硬碟）
const storage = multer.memoryStorage();

// 檔案過濾器：只接受 JPG 和 PNG
const imageFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (![".jpg", ".png", ".jpeg"].includes(ext)) {
    return cb(new Error("只接受 JPG/PNG 格式的圖片檔案"));
  }
  cb(null, true);
};

// 限制：2 MB、JPG/PNG 格式
export const imageUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: imageFileFilter,
});
