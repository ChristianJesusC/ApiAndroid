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
