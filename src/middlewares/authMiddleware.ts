import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { query } from "../database/sql";

interface JwtPayload {
  username: string;
  iat?: number;
  exp?: number;
}

interface AuthenticatedRequest extends Request {
  usuario?: {
    id: number;
    username: string;
  };
}

export function verificarToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    res.status(401).json({ mensaje: "Token requerido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    query('SELECT id, username FROM usuarios WHERE username = ?', [decoded.username])
      .then(([rows]: any) => {
        if (rows && rows.length > 0) {
          req.usuario = {
            id: rows[0].id,
            username: rows[0].username
          };
          console.log(`🔐 Usuario autenticado: ${req.usuario.username} (ID: ${req.usuario.id})`);
          next();
        } else {
          res.status(401).json({ mensaje: "Usuario no encontrado" });
          return;
        }
      })
      .catch(error => {
        console.error("❌ Error verificando usuario:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
        return;
      });
      
  } catch (err) {
    console.error("❌ Error verificando token:", err);
    res.status(401).json({ mensaje: "Token inválido" });
    return;
  }
}