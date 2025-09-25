import { Request, Response } from "express";
import { ObtenerUsuariosCasoUso } from "../../application/metodosUsuarios/ObtenerUsuariosCasoUso";

export class ObtenerUsuariosController {
  constructor(private readonly casoUso: ObtenerUsuariosCasoUso) {}

  async run(req: Request, res: Response) {
    const resultado = await this.casoUso.run();
    if (!resultado) {
      res.status(500).json({
        message: "no se pudieron obtener los usuarios",
        usuarios: null,
      });
      return;
    }
    res.status(200).json({
      message: "usuarios recuperados con exito",
      usuarios: resultado,
    });
  }
}
