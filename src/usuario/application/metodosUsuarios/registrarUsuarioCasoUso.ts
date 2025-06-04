import { Usuario } from '../../domain/entities/Usuario'
import { UsuarioRepository } from '../../domain/repositories/UsuarioRepository'

export class RegistrarUsuarioCasoUso {
    constructor(private readonly repo: UsuarioRepository) {}

    async ejecutar(usuario: Usuario): Promise<void> {
        await this.repo.registrar(usuario)
    }
}
