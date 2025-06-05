import { Router } from "express";
import { juegoController } from "./../DependenciesJuegos";

const router = Router();

router.post("/", juegoController.crearJuego);
router.get("/", juegoController.obtenerJuegos);
router.put("/:id", juegoController.actualizarJuego);
router.delete("/:id", juegoController.eliminarJuego);

export default router;
