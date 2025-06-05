import { JuegoRepositoryImpl } from "../infrastructure/repository/UsuarioRepositoryImpl";
import { CrearJuego } from "../application/CaseUse/CrearJuego";
import { ObtenerJuegos } from "../application/CaseUse/ObtenerJuegos";
import { ActualizarJuego } from "../application/CaseUse/ActualizarJuego";
import { EliminarJuego } from "../application/CaseUse/EliminarJuego"
import { JuegoController } from "./controller/JuegoController";

const repo = new JuegoRepositoryImpl();

const crearJuego = new CrearJuego(repo);
const obtenerJuegos = new ObtenerJuegos(repo);
const actualizarJuego = new ActualizarJuego(repo);
const eliminarJuego = new EliminarJuego(repo);

export const juegoController = new JuegoController(
  crearJuego,
  obtenerJuegos,
  actualizarJuego,
  eliminarJuego
);
