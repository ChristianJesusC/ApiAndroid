import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generarToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1m", // 1 minuto de expiración
  });
}
