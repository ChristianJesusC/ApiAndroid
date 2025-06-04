import { UsuarioRepository } from '../../domain/repositories/UsuarioRepository'

export class LoginUsuarioCasoUso {
    constructor(private readonly repo: UsuarioRepository) {}

    async ejecutar(username: string, password: string): Promise<boolean> {
        return this.repo.login(username, password)
    }
}
