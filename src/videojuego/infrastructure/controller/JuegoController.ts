import { Request, Response } from "express";
import { CrearJuego } from "../../application/CaseUse/CrearJuego";
import { ActualizarJuego } from "../../application/CaseUse/ActualizarJuego";
import { ObtenerJuegos } from "../../application/CaseUse/ObtenerJuegos";
import { EliminarJuego } from "../../application/CaseUse/EliminarJuego";
import { Juego } from "../../domain/entities/Juego";
import { query } from '../../../database/sql';
import { firebaseService } from '../../../services/FirebaseService';

export class JuegoController {
  constructor(
    private readonly crear: CrearJuego,
    private readonly obtener: ObtenerJuegos,
    private readonly actualizar: ActualizarJuego,
    private readonly eliminar: EliminarJuego
  ) {}

  crearJuego = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("📋 Body recibido:", req.body);
      console.log("📁 Archivo recibido:", req.file);

      const { nombre, compania, descripcion, cantidad } = req.body;

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
      console.log("✅ Juego creado exitosamente");

      try {
        console.log('📱 Enviando notificaciones push para nuevo juego...');
        
        const [rows]: any = await query(
          'SELECT DISTINCT token FROM device_tokens WHERE is_active = true', 
          []
        );
        
        const tokens = rows.map((row: any) => row.token);
        console.log(`📋 Tokens activos encontrados: ${tokens.length}`);
        
        if (tokens.length > 0) {
          const notificationSent = await firebaseService.sendNotificationToTokens(
            tokens,
            '🎮 Nuevo juego disponible!',
            `${nombre} de ${compania} ya está disponible en nuestra tienda`,
            {
              tipo: 'nuevo_juego',
              juego_nombre: nombre,
              juego_compania: compania,
              action: 'view_game',
              timestamp: Date.now().toString()
            }
          );
          
          if (notificationSent) {
            console.log('🎉 Notificaciones enviadas correctamente');
          } else {
            console.log('⚠️ No se pudieron enviar las notificaciones');
          }
        } else {
          console.log('📱 No hay dispositivos registrados para notificaciones');
        }
        
      } catch (notificationError) {
        console.error('❌ Error enviando notificaciones:', notificationError);
      }

      res.status(201).json({
        success: true,
        mensaje: "Juego creado correctamente",
        data: juego,
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

  actualizarJuego = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { nombre, compania, descripcion, cantidad } = req.body;

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

      res.json({
        success: true,
        mensaje: "Juego actualizado correctamente",
        data: juego,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Error al actualizar juego",
      });
    }
  };

  eliminarJuego = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.eliminar.ejecutar(Number(id));
      res.json({
        success: true,
        mensaje: "Juego eliminado correctamente",
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