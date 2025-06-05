import { Juego } from "../../domain/entities/Juego";
import { JuegoRepository } from "../../domain/repositories/JuegoRepository";
import { query } from "../../../database/sql";

export class JuegoRepositoryImpl implements JuegoRepository {
  async crear(juego: Juego): Promise<void> {
    await query("INSERT INTO juegos ( nombre, compania, descripcion, cantidad) VALUES (?, ?, ?, ?)", 
      [juego.nombre, juego.compania, juego.descripcion, juego.cantidad]);
  }

  async obtenerTodos(): Promise<Juego[]> {
    const [rows]: any = await query("SELECT * FROM juegos", []);
    return rows.map((r: any) => new Juego(r.id, r.nombre, r.compania, r.descripcion, r.cantidad));
  }

  async actualizar(juego: Juego): Promise<void> {
    await query("UPDATE juegos SET nombre=?, compania=?, descripcion=?, cantidad=? WHERE id=?",
      [juego.nombre, juego.compania, juego.descripcion, juego.cantidad, juego.id]);
  }

  async eliminar(id: number): Promise<void> {
    await query("DELETE FROM juegos WHERE id = ?", [id]);
  }
}
