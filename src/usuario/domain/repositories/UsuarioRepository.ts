import { Usuario } from '../entities/Usuario'

export interface UsuarioRepository {
    registrar(usuario: Usuario): Promise<void>
    login(username: string, password: string): Promise<boolean>
    obtenerUsuarios(): Promise<Usuario[] | null>
}
