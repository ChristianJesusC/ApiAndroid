import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import usuarioRoutes from "./usuario/infrastructure/router/usuarioRoutes";
import juegoRoutes from "./videojuego/infrastructure/router/juegoRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/usuarios", usuarioRoutes);
app.use("/juegos", juegoRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.clear();
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
