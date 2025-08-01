import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verificarToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    res.status(401).json({ mensaje: "Token requerido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ mensaje: "Token inválido" });
    return;
  }
}