// utils/jwtUtils.ts
import * as jwt from "jsonwebtoken";

export interface JWTPayload {
  id: string;
  email: string;
}

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in .env");
}
const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, SECRET) as JWTPayload;
}
