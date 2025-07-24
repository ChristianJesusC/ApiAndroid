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
    return result;
  } catch (error) {
    console.error("Error en la consulta SQL:", error);
    return null;
  }
}

// Función para crear las tablas
export async function crearTablas() {
  try {
    // Crear tabla usuarios
    const crearTablaUsuarios = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `;

    // Crear tabla juegos
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

    await query(crearTablaUsuarios, []);
    await query(crearTablaJuegos, []);
    
    console.log("📊 Tablas creadas exitosamente");
  } catch (error) {
    console.error("❌ Error al crear las tablas:", error);
    throw error;
  }
}

// Función para inicializar la base de datos
export async function inicializarDB() {
  try {
    console.log("🔄 Verificando conexión a la base de datos...");
    
    // Verificar conexión
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    
    console.log("✅ Conexión a la base de datos establecida");
    
    // Crear tablas
    await crearTablas();
    
    console.log("🎉 Base de datos inicializada correctamente");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
    throw error;
  }
}