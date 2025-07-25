import { Router } from "express";
import { juegoController } from "../DependenciesJuegos";
import { upload } from "../../../middlewares/upload";

const router = Router();

router.post("/", upload.single("logo"), juegoController.crearJuego);
router.get("/", juegoController.obtenerJuegos);
router.put("/:id", upload.single("logo"), juegoController.actualizarJuego);
router.delete("/:id", juegoController.eliminarJuego);

export default router;

