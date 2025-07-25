// src/middlewares/upload.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Usar process.cwd() para obtener la raíz del proyecto
const uploadDir = path.join(process.cwd(), 'uploads');
console.log('📁 Directorio de uploads:', uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Directorio uploads creado');
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre único para el archivo
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `game-logo-${uniqueName}${extension}`;
    console.log('🖼️ Guardando archivo como:', filename);
    cb(null, filename);
  }
});

// Filtro para validar tipos de archivo
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('🔍 Validando archivo:', file.originalname, 'MIME:', file.mimetype);
  
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)'));
  }
};

// Configuración de multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: fileFilter
});