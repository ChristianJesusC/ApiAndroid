import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

class FirebaseService {
    private static instance: FirebaseService;
    private messaging: any;//admin.messaging.Messaging;

    private constructor() {
        if (!admin.apps.length) {
            try {
                const configPath = path.join(process.cwd(), 'config', 'firebase-service-account.json');
                
                if (!fs.existsSync(configPath)) {
                    console.error('❌ Archivo de credenciales no encontrado en:', configPath);
                    throw new Error('Archivo de credenciales Firebase no encontrado');
                }
                
                const serviceAccount = require(configPath);
                
                if (!serviceAccount.project_id || !serviceAccount.private_key) {
                    throw new Error('Archivo de credenciales Firebase inválido');
                }
                
                console.log('🔥 Inicializando Firebase con proyecto:', serviceAccount.project_id);
                
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    projectId: serviceAccount.project_id
                });
                
                console.log('✅ Firebase Admin inicializado correctamente');
            } catch (error) {
                console.error('❌ Error inicializando Firebase Admin:', error);
                throw error;
            }
        }
        
        this.messaging = admin.messaging();
    }

    public static getInstance(): FirebaseService {
        if (!FirebaseService.instance) {
            FirebaseService.instance = new FirebaseService();
        }
        return FirebaseService.instance;
    }

    async sendNotificationToTokens(tokens: string[], title: string, body: string, data?: any): Promise<boolean> {
        if (tokens.length === 0) {
            console.log('⚠️ No hay tokens para enviar notificaciones');
            return false;
        }

        console.log(`📱 Enviando notificaciones a ${tokens.length} dispositivos`);

        try {
            // Intentar sendMulticast primero (versiones nuevas)
            if (typeof this.messaging.sendMulticast === 'function') {
                const message = {
                    notification: { title, body },
                    data: data ? this.convertDataToStrings(data) : {},
                    tokens: tokens
                };
                
                const response = await this.messaging.sendMulticast(message);
                console.log(`✅ Notificaciones enviadas: ${response.successCount}/${tokens.length}`);
                
                if (response.failureCount > 0) {
                    console.log(`❌ Fallos: ${response.failureCount}`);
                    response.responses.forEach((resp:any, idx:number) => {
                        if (!resp.success && resp.error) {
                            console.error(`❌ Error en token ${idx}:`, resp.error.message);
                        }
                    });
                }
                
                return response.successCount > 0;
            }
            // Fallback para versiones anteriores
            else {
                return await this.sendOneByOne(tokens, title, body, data);
            }
        } catch (error) {
            console.error('❌ Error enviando notificaciones FCM:', error);
            return false;
        }
    }

    private async sendOneByOne(tokens: string[], title: string, body: string, data?: any): Promise<boolean> {
        let successCount = 0;
        
        console.log('📱 Enviando notificaciones individuales...');
        
        for (let i = 0; i < tokens.length; i++) {
            try {
                await this.messaging.send({
                    token: tokens[i],
                    notification: { title, body },
                    data: data ? this.convertDataToStrings(data) : {}
                });
                successCount++;
                console.log(`✅ Notificación ${i + 1}/${tokens.length} enviada`);
            } catch (error: any) {
                console.error(`❌ Error enviando notificación ${i + 1}:`, error.message);
            }
        }
        
        console.log(`📊 Resultado final: ${successCount}/${tokens.length} enviadas correctamente`);
        return successCount > 0;
    }

    private convertDataToStrings(data: any): Record<string, string> {
        const result: Record<string, string> = {};
        for (const [key, value] of Object.entries(data)) {
            result[key] = String(value);
        }
        return result;
    }
}

export const firebaseService = FirebaseService.getInstance();