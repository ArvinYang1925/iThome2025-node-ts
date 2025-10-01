import { Response, NextFunction } from "express";
import path from "path";
import { bucket } from "../utils/firebaseUtils";
import { AuthRequest } from "../middleware/isAuth";
import { AppDataSource } from "../config/db";
import { User } from "../entities/User";

/**
 * 上傳大頭照到 Firebase Storage
 */
export async function uploadAvatar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // 1. 檢查是否有上傳檔案
    if (!req.file) {
      res.status(400).json({
        status: "failed",
        message: "請選擇要上傳的圖片檔案",
      });
      return;
    }

    // 2. 檢查使用者是否已登入
    if (!req.user) {
      res.status(401).json({
        status: "failed",
        message: "請先登入",
      });
      return;
    }

    // 3. 產生遠端檔案路徑
    const timestamp = Date.now();
    const ext = path.extname(req.file.originalname).toLowerCase();
    const remotePath = `images/avatars/user-${req.user.id}-${timestamp}${ext}`;

    // 4. 取得 Firebase Storage 檔案參考
    const file = bucket.file(remotePath);

    // 5. 建立寫入串流
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // 6. 錯誤處理
    stream.on("error", (err) => next(err));

    // 7. 上傳完成後的處理
    stream.on("finish", async () => {
      try {
        // 設定檔案為公開存取
        await file.makePublic();

        // 產生公開 URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${remotePath}`;

        // 8. 更新資料庫
        await AppDataSource.getRepository(User).update({ id: req.user?.id }, { profileUrl: publicUrl });

        // 9. 回傳成功訊息
        res.status(200).json({
          status: "success",
          message: "大頭照上傳成功",
          data: { avatarUrl: publicUrl },
        });
      } catch (err) {
        next(err);
      }
    });

    // 10. 將檔案緩衝區寫入串流
    stream.end(req.file.buffer);
  } catch (err) {
    next(err);
  }
}
