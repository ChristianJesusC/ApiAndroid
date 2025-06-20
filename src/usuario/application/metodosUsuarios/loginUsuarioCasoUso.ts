import { UsuarioRepository } from '../../domain/repositories/UsuarioRepository'
import { generarToken } from '../../utils/jws'

export class LoginUsuarioCasoUso {
    constructor(private readonly repo: UsuarioRepository) {}

    async ejecutar(username: string, password: string): Promise<string | null> {
        const valido = await this.repo.login(username, password)
        if(valido) {
            const token = generarToken({ username })
            return token // Retorna el token si el login es exitoso
        }
        return null
    }
}
