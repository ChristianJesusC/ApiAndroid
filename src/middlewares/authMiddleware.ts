import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verificarToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ mensaje: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).usuario = decoded; // opcional: puedes adjuntar info del usuario
    next();
  } catch (err) {
    res.status(401).json({ mensaje: "Token inválido" });
  }
}
