import { Request, Response } from 'express'
import { LoginUsuarioCasoUso } from '../../application/metodosUsuarios/loginUsuarioCasoUso'

export class LoginUsuarioController {
    constructor(
        private readonly loginCasoUso: LoginUsuarioCasoUso
    ) {}

    login = async (req: Request, res: Response) => {
        const { username, password } = req.body

        const valid = await this.loginCasoUso.ejecutar(username, password)

        if (valid) {
            res.status(200).json({ mensaje: 'Login exitoso' })
            console.log(`Usuario ${username} ha iniciado sesión exitosamente`);
            
        } else {
            res.status(401).json({ mensaje: 'Credenciales incorrectas' })
        }
    }
}
