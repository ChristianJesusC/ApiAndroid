import { Request, Response } from 'express'
import { RegistrarUsuarioCasoUso } from '../../application/metodosUsuarios/registrarUsuarioCasoUso'
import { Usuario } from '../../domain/entities/Usuario'

export class RegistrarUsuarioController {
    constructor(
        private readonly registrarCasoUso: RegistrarUsuarioCasoUso
    ) {}

    registrar = async (req: Request, res: Response) => {
        const { username, password } = req.body

        const usuario = new Usuario(0, username, password)
        await this.registrarCasoUso.ejecutar(usuario)

        res.status(201).json({ mensaje: 'Usuario registrado' })
    }
}
