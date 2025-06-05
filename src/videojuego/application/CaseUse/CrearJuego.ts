import { Juego } from "../../domain/entities/Juego";
import { JuegoRepository } from "../../domain/repositories/JuegoRepository";

export class CrearJuego {
    constructor(private readonly juegoRepo: JuegoRepository) {}

    async ejecutar(juego: Juego): Promise<void> {
        await this.juegoRepo.crear(juego);
    }
}
