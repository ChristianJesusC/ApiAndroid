import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

export const sqlConexion = {
  host: process.env.HOST,
  user: process.env.USUARIO,
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
};

const pool = mysql.createPool(sqlConexion);

export async function query(sql: string, params: any[]) {
  try {
    const conn = await pool.getConnection();
    const result = await conn.execute(sql, params);
    conn.release();
    console.clear();
    return result;
  } catch (error) {
    console.error("Error en la consulta SQL:", error);
    return null;
  }
}

export async function crearTablas() {
  try {
    const crearTablaUsuarios = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `;

    const crearTablaJuegos = `
      CREATE TABLE IF NOT EXISTS juegos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        compania VARCHAR(255) NOT NULL,
        descripcion TEXT,
        cantidad INT NOT NULL DEFAULT 0,
        logo VARCHAR(500)
      )
    `;

    const crearTablaDeviceTokens = `
      CREATE TABLE IF NOT EXISTS device_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(500) NOT NULL UNIQUE,
        platform ENUM('android', 'ios', 'web') NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `;

    await query(crearTablaUsuarios, []);
    await query(crearTablaJuegos, []);
    await query(crearTablaDeviceTokens, []);
    
    console.log("📊 Tablas creadas exitosamente");
  } catch (error) {
    console.error("❌ Error al crear las tablas:", error);
    throw error;
  }
}

export async function inicializarDB() {
  try {
    console.log("🔄 Verificando conexión a la base de datos...");
    
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    
    console.log("✅ Conexión a la base de datos establecida");
    
    await crearTablas();
    
    console.log("🎉 Base de datos inicializada correctamente");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
    throw error;
  }
}