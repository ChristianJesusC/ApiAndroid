import { Request, Response } from "express";
import { CrearJuego } from "../../application/CaseUse/CrearJuego";
import { ActualizarJuego } from "../../application/CaseUse/ActualizarJuego";
import { ObtenerJuegos } from "../../application/CaseUse/ObtenerJuegos";
import { EliminarJuego } from "../../application/CaseUse/EliminarJuego";
import { Juego } from "../../domain/entities/Juego";
import { query } from "../../../database/sql";
import { firebaseService } from "../../../services/FirebaseService";

interface AuthenticatedRequest extends Request {
  usuario?: {
    id: number;
    username: string;
  };
}

export class JuegoController {
  constructor(
    private readonly crear: CrearJuego,
    private readonly obtener: ObtenerJuegos,
    private readonly actualizar: ActualizarJuego,
    private readonly eliminar: EliminarJuego
  ) {}

  crearJuego = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      console.log("📋 Body recibido:", req.body);
      console.log("📁 Archivo recibido:", req.file);
      console.log("👤 Usuario autenticado:", req.usuario);

      const { nombre, compania, descripcion, cantidad } = req.body;
      const usuario = req.usuario

      if (!usuario) {
        res.status(401).json({
          success: false,
          error: "Usuario no autenticado",
        });
        return;
      }

      const logoPath = req.file ? `/uploads/${req.file.filename}` : "";
      console.log("🖼️ Logo path generado:", logoPath);

      const juego = new Juego(
        null,
        nombre,
        compania,
        descripcion,
        parseInt(cantidad),
        logoPath
      );

      await this.crear.ejecutar(juego);
      console.log(`✅ Juego creado exitosamente por ${usuario.username}`);

      try {
        console.log("📱 Enviando notificaciones push para nuevo juego...");

        const [rows]: any = await query(
          "SELECT DISTINCT token FROM device_tokens WHERE is_active = true",
          []
        );

        const tokens = rows.map((row: any) => row.token);
        console.log(`📋 Tokens activos encontrados: ${tokens.length}`);

        if (tokens.length > 0) {
          const notificationSent =
            await firebaseService.sendNotificationToTokens(
              tokens,
              "🎮 Nuevo juego agregado!",
              `${usuario.username} agregó "${nombre}" de ${compania} a la tienda`,
              {
                tipo: "nuevo_juego",
                juego_nombre: nombre,
                juego_compania: compania,
                usuario_creador: usuario.username,
                usuario_id: usuario.id.toString(),
                action: "view_game",
                timestamp: Date.now().toString(),
              }
            );

          if (notificationSent) {
            console.log("🎉 Notificaciones enviadas correctamente");
          } else {
            console.log("⚠️ No se pudieron enviar las notificaciones");
          }
        } else {
          console.log("📱 No hay dispositivos registrados para notificaciones");
        }
      } catch (notificationError) {
        console.error("❌ Error enviando notificaciones:", notificationError);
      }

      res.status(201).json({
        success: true,
        mensaje: "Juego creado correctamente",
        data: {
          ...juego,
          creado_por: usuario.username,
        },
      });
    } catch (error) {
      console.error("❌ Error al crear juego:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  obtenerJuegos = async (_: Request, res: Response): Promise<void> => {
    try {
      const juegos = await this.obtener.ejecutar();

      const juegosConLogos = juegos.map((juego) => ({
        ...juego,
        logo: juego.logo ? juego.logo : "/uploads/default-game.png",
      }));

      res.json({
        success: true,
        data: juegosConLogos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Error al obtener juegos",
      });
    }
  };

  actualizarJuego = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { nombre, compania, descripcion, cantidad } = req.body;
      const usuario = req.usuario;

      if (!usuario) {
        res.status(401).json({
          success: false,
          error: "Usuario no autenticado",
        });
        return;
      }

      let logoPath = "";
      if (req.file) {
        logoPath = `/uploads/${req.file.filename}`;
      } else {
        logoPath = req.body.logoActual || "";
      }

      const juego = new Juego(
        Number(id),
        nombre,
        compania,
        descripcion,
        parseInt(cantidad),
        logoPath
      );
      await this.actualizar.ejecutar(juego);

      console.log(`✅ Juego actualizado por ${usuario.username}`);

      try {
        const [rows]: any = await query(
          "SELECT DISTINCT token FROM device_tokens WHERE is_active = true",
          []
        );

        const tokens = rows.map((row: any) => row.token);

        if (tokens.length > 0) {
          await firebaseService.sendNotificationToTokens(
            tokens,
            "📝 Juego actualizado!",
            `${usuario.username} actualizó "${nombre}"`,
            {
              tipo: "juego_actualizado",
              juego_nombre: nombre,
              juego_id: id,
              usuario_editor: usuario.username,
              action: "view_game",
              timestamp: Date.now().toString(),
            }
          );
        }
      } catch (notificationError) {
        console.error(
          "❌ Error enviando notificación de actualización:",
          notificationError
        );
      }

      res.json({
        success: true,
        mensaje: "Juego actualizado correctamente",
        data: {
          ...juego,
          actualizado_por: usuario.username,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Error al actualizar juego",
      });
    }
  };

  eliminarJuego = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const usuario = req.usuario;

      if (!usuario) {
        res.status(401).json({
          success: false,
          error: "Usuario no autenticado",
        });
        return;
      }

      const [rows]: any = await query(
        "SELECT nombre FROM juegos WHERE id = ?",
        [id]
      );
      const nombreJuego =
        rows.length > 0 ? rows[0].nombre : "Juego desconocido";

      await this.eliminar.ejecutar(Number(id));
      console.log(`✅ Juego eliminado por ${usuario.username}`);

      try {
        const [tokenRows]: any = await query(
          "SELECT DISTINCT token FROM device_tokens WHERE is_active = true",
          []
        );

        const tokens = tokenRows.map((row: any) => row.token);

        if (tokens.length > 0) {
          await firebaseService.sendNotificationToTokens(
            tokens,
            "🗑️ Juego eliminado",
            `${usuario.username} eliminó "${nombreJuego}" de la tienda`,
            {
              tipo: "juego_eliminado",
              juego_nombre: nombreJuego,
              usuario_eliminador: usuario.username,
              action: "refresh_games",
              timestamp: Date.now().toString(),
            }
          );
        }
      } catch (notificationError) {
        console.error(
          "❌ Error enviando notificación de eliminación:",
          notificationError
        );
      }

      res.json({
        success: true,
        mensaje: "Juego eliminado correctamente",
        eliminado_por: usuario.username,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Error al eliminar juego",
      });
    }
  };
}
