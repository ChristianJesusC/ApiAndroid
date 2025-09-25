import { Router } from 'express'
import { registrarUsuarioController, loginUsuarioController, obtenerUsuariosController } from '../DependenciesUsuarios'

const router = Router()

router.post('/registrar', registrarUsuarioController.registrar)
router.post('/login', loginUsuarioController.login)
router.get('/obtenerTodos', obtenerUsuariosController.run);

export default router
