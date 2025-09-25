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

        async obtenerUsuarios() {
        try {
            const usuarios: any = await query("SELECT * FROM usuarios", []);

            if (!usuarios) {
                console.log("no hay usuarios, error desconocido");
                return null;
            }

            const [rows] = usuarios;

            if (rows.length === 0) {
                console.log("no hay usuarios en la db");
                return [];
            }

            // mapear cada fila a un Usuario
            const listaUsuarios: Usuario[] = rows.map((row: any) =>
                new Usuario(row.id, row.username, row.password)
            );

            return listaUsuarios;

        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
