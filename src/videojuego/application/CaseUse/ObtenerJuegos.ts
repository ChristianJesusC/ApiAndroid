import { Juego } from "../../domain/entities/Juego";
import { JuegoRepository } from "../../domain/repositories/JuegoRepository";

export class ObtenerJuegos {
    constructor(private readonly juegoRepo: JuegoRepository) {}

    async ejecutar(): Promise<Juego[]> {
        return await this.juegoRepo.obtenerTodos();
    }
}
