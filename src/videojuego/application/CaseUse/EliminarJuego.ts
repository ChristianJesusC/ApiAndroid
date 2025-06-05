import { JuegoRepository } from "../../domain/repositories/JuegoRepository";

export class EliminarJuego {
    constructor(private readonly juegoRepo: JuegoRepository) {}

    async ejecutar(id: number): Promise<void> {
        await this.juegoRepo.eliminar(id);
    }
}
