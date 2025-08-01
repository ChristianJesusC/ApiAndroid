import { Request, Response } from 'express';
import { query } from '../../database/sql';
import { firebaseService } from '../../services/FirebaseService';

export class NotificationController {
    
    registerDeviceToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token, platform } = req.body;
            
            if (!token || !platform) {
                res.status(400).json({
                    success: false,
                    error: 'Token y platform son requeridos'
                });
                return;
            }
            
            const userId = (req as any).usuario?.id || 1; 
            
            console.log(`📱 Registrando token para usuario ${userId}:`, token.substring(0, 20) + '...');
            
            await query(
                `INSERT INTO device_tokens (user_id, token, platform, is_active) 
                 VALUES (?, ?, ?, ?) 
                 ON DUPLICATE KEY UPDATE 
                 platform = VALUES(platform), 
                 is_active = VALUES(is_active), 
                 updated_at = CURRENT_TIMESTAMP`,
                [userId, token, platform, true]
            );
            
            console.log('✅ Token registrado correctamente');
            
            res.status(200).json({
                success: true,
                mensaje: 'Token registrado correctamente'
            });
        } catch (error) {
            console.error('❌ Error registrando token:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    };

    removeDeviceToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token } = req.body;
            
            if (!token) {
                res.status(400).json({
                    success: false,
                    error: 'Token es requerido'
                });
                return;
            }
            
            await query('UPDATE device_tokens SET is_active = false WHERE token = ?', [token]);
            
            res.status(200).json({
                success: true,
                mensaje: 'Token desactivado correctamente'
            });
        } catch (error) {
            console.error('❌ Error desactivando token:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    };

    testNotification = async (req: Request, res: Response): Promise<void> => {
        try {
            const { title, body, data } = req.body;
            
            console.log('🧪 Enviando notificación de prueba...');
            
            const [rows]: any = await query(
                'SELECT DISTINCT token FROM device_tokens WHERE is_active = true', 
                []
            );
            
            const tokens = rows.map((row: any) => row.token);
            console.log(`📋 Tokens activos encontrados: ${tokens.length}`);
            
            if (tokens.length > 0) {
                const result = await firebaseService.sendNotificationToTokens(
                    tokens,
                    title || 'Notificación de prueba',
                    body || 'Esta es una prueba del sistema de notificaciones',
                    data || { tipo: 'test', timestamp: Date.now().toString() }
                );
                
                res.json({
                    success: true,
                    message: `Notificación enviada a ${tokens.length} dispositivos`,
                    result: result
                });
            } else {
                res.json({
                    success: false,
                    message: 'No hay tokens registrados'
                });
            }
        } catch (error) {
            console.error('❌ Error en notificación de prueba:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    };

    getRegisteredTokens = async (req: Request, res: Response): Promise<void> => {
        try {
            const [rows]: any = await query(
                'SELECT id, user_id, platform, is_active, created_at FROM device_tokens ORDER BY created_at DESC', 
                []
            );
            
            res.json({
                success: true,
                data: rows,
                total: rows.length
            });
        } catch (error) {
            console.error('❌ Error obteniendo tokens:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    };
}

export const notificationController = new NotificationController();