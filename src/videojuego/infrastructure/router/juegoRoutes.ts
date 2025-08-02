import { Router } from "express";
import { juegoController } from "../DependenciesJuegos";
import { upload } from "../../../middlewares/upload";
import { verificarToken } from "../../../middlewares/authMiddleware";

const router = Router();

router.post("/", verificarToken, upload.single("logo"), juegoController.crearJuego);
router.get("/", juegoController.obtenerJuegos); // Esta puede quedarse sin auth para que la app pueda ver los juegos
router.put("/:id", verificarToken, upload.single("logo"), juegoController.actualizarJuego);
router.delete("/:id", verificarToken, juegoController.eliminarJuego);

export default router;