import { UsuarioRepository } from "../../domain/repositories/UsuarioRepository";

export class ObtenerUsuariosCasoUso {
    constructor(private readonly repository: UsuarioRepository) { }
    
    async run() {
        return await this.repository.obtenerUsuarios();
    }
}