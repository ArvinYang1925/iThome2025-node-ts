// controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../validator/authValidationSchemas";
import { AppDataSource } from "../config/db";
import { User } from "../entities/User";
import { hashPassword, comparePassword } from "../utils/passwordUtils";
import { generateToken } from "../utils/jwtUtils";
import jwt from "jsonwebtoken";

const userRepo = AppDataSource.getRepository(User);

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      res.status(400).json({ status: "failed", message: issue.message });
      return;
    }

    const { name, email, password } = parsed.data;

    // 檢查是否已註冊
    const exists = await userRepo.findOneBy({ email });
    if (exists) {
      res.status(409).json({ status: "failed", message: "Email 已被使用" });
      return;
    }

    // 建立 User
    const hashed = await hashPassword(password);
    const user = userRepo.create({
      name,
      email,
      password: hashed,
    });
    const saved = await userRepo.save(user);

    // 生成 token
    const token = generateToken({ id: saved.id, email: saved.email });
    const { exp, iat } = jwt.decode(token) as { exp: number; iat: number };
    const expiresIn = exp - iat;

    res.status(201).json({
      status: "success",
      message: "註冊成功",
      data: {
        token,
        expiresIn,
        userInfo: {
          id: saved.id,
          name: saved.name,
          email: saved.email,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(401).json({ status: "failed", message: "帳號或密碼錯誤" });
      return;
    }

    const { email, password } = parsed.data;
    const user = await userRepo.findOneBy({ email });

    if (!user || !(await comparePassword(password, user.password))) {
      res.status(401).json({ status: "failed", message: "帳號或密碼錯誤" });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email });
    const { exp, iat } = jwt.decode(token) as { exp: number; iat: number };
    const expiresIn = exp - iat;

    res.status(200).json({
      status: "success",
      message: "登入成功",
      data: {
        token,
        expiresIn,
        userInfo: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({
      status: "success",
      message: "登出成功",
    });
  } catch (err) {
    next(err);
  }
}
