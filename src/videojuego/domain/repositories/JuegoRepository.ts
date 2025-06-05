import { Juego } from "../entities/Juego";

export interface JuegoRepository {
  crear(juego: Juego): Promise<void>;
  obtenerTodos(): Promise<Juego[]>;
  actualizar(juego: Juego): Promise<void>;
  eliminar(id: number): Promise<void>;
}
