import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/db";
import todoRoutes from "./routes/todoRoutes";
import authRoutes from "./routes/authRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import dotenv from "dotenv";
import logger from "./utils/logger"; // 導入 logger
import pinoHttp from "pino-http";

dotenv.config();

const app = express();
app.use(express.json());

// 添加 HTTP logger 中間件（放在其他路由之前）
app.use(pinoHttp({ logger }));

app.use("/api/todos", todoRoutes); // 加上 Todo 路由
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes); // 上傳路由

app.get("/", (req, res) => {
  res.send("Hello, iThome 2025!");
});

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("📦 DB Connected!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });
