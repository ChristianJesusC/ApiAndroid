import { Request, Response } from "express";
import { CrearJuego } from "../../application/CaseUse/CrearJuego";
import { ActualizarJuego } from "../../application/CaseUse/ActualizarJuego";
import { ObtenerJuegos } from "../../application/CaseUse/ObtenerJuegos";
import { EliminarJuego } from "../../application/CaseUse/EliminarJuego";
import { Juego } from "../../domain/entities/Juego";

export class JuegoController {
  constructor(
    private readonly crear: CrearJuego,
    private readonly obtener: ObtenerJuegos,
    private readonly actualizar: ActualizarJuego,
    private readonly eliminar: EliminarJuego
  ) {}

  crearJuego = async (req: Request, res: Response) => {
    const { nombre, compania, descripcion, cantidad } = req.body;
    const juego = new Juego(null,nombre, compania, descripcion, cantidad);
    await this.crear.ejecutar(juego);
    res.status(201).json({ mensaje: "Juego creado correctamente" });
  };

  obtenerJuegos = async (_: Request, res: Response) => {
    const juegos = await this.obtener.ejecutar();
    res.json(juegos);
  };

  actualizarJuego = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, compania, descripcion, cantidad } = req.body;
    const juego = new Juego(Number(id), nombre, compania, descripcion, cantidad);
    await this.actualizar.ejecutar(juego);
    res.json({ mensaje: "Juego actualizado correctamente" });
  };

  eliminarJuego = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.eliminar.ejecutar(Number(id));
    res.json({ mensaje: "Juego eliminado correctamente" });
  };
}
