import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import usuarioRoutes from "./usuario/infrastructure/router/usuarioRoutes";
import juegoRoutes from "./videojuego/infrastructure/router/juegoRoutes";
import path from "path";
import { inicializarDB } from "./database/sql";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/usuarios", usuarioRoutes);
app.use("/juegos", juegoRoutes);

const PORT = process.env.PORT;
const HOST = process.env.HOST || 'localhost';

async function startServer() {
  try {
    await inicializarDB();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.clear();
      console.log("🚀 Servidor corriendo en el puerto", PORT);
      console.log("🌐 API disponible en:");
      console.log(`   • Usuarios: http://${HOST}:${PORT}/usuarios`);
      console.log(`   • Juegos: http://${HOST}:${PORT}/juegos`);
      console.log(`   • Uploads: http://${HOST}:${PORT}/uploads`);
    });
  } catch (error) {
    console.error("💥 Error al iniciar el servidor:", error);
    console.error("🔧 Verifica tu configuración de base de datos en el archivo .env");
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  process.exit(1);
});

startServer();