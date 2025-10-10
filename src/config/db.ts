import "reflect-metadata";
import { DataSource } from "typeorm";
import { Todo } from "../entities/Todo";
import { User } from "../entities/User";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  entities: [Todo, User],
  synchronize: false, // ⚠️ 改為 false，改用 migration 管理
  logging: true,
  migrations: process.env.NODE_ENV === "production" ? [__dirname + "/../migrations/*.js"] : ["src/migrations/**/*.ts"], // 📁 migration 檔案路徑
  migrationsTableName: "migrations_history", // 📊 migration 歷史記錄表名稱
});
