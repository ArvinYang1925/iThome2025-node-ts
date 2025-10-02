import pino from "pino";

// 判斷是否為開發環境
const isDevelopment = process.env.NODE_ENV !== "production";

// 創建 logger 實例
const logger = pino({
  level: process.env.LOG_LEVEL || "info", // 預設 log 級別
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true, // 彩色輸出
          translateTime: "SYS:yyyy-mm-dd HH:MM:ss", // 時間格式
          ignore: "pid,hostname", // 忽略不需要的欄位
        },
      }
    : undefined, // 生產環境直接輸出 JSON
});

export default logger;
