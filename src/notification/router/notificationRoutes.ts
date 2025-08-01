import { Router } from 'express';
import { notificationController } from '../controller/NotificationController';
import { verificarToken } from '../../middlewares/authMiddleware';

const router = Router();

router.post('/device-token', verificarToken, notificationController.registerDeviceToken);

router.delete('/device-token', notificationController.removeDeviceToken);

router.post('/test', notificationController.testNotification);

router.get('/tokens', notificationController.getRegisteredTokens);

export default router;