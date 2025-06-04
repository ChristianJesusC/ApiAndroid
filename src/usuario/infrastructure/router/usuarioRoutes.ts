import { Router } from 'express'
import { registrarUsuarioController, loginUsuarioController } from '../DependenciesUsuarios'

const router = Router()

router.post('/registrar', registrarUsuarioController.registrar)
router.post('/login', loginUsuarioController.login)

export default router
