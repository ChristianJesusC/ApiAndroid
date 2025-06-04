import { Usuario } from '../../domain/entities/Usuario'
import { UsuarioRepository } from '../../domain/repositories/UsuarioRepository'
import { query } from '../../../database/sql'

export class UsuarioRepositoryImpl implements UsuarioRepository {
    async registrar(usuario: Usuario): Promise<void> {
        await query(
            'INSERT INTO usuarios (username, password) VALUES (?, ?)',
            [usuario.username, usuario.password]
        )
    }

    async login(username: string, password: string): Promise<boolean> {
        const result: any = await query(
            'SELECT * FROM usuarios WHERE username = ? AND password = ?',
            [username, password]
        )

        const [rows] = result
        return rows.length > 0
    }
}
