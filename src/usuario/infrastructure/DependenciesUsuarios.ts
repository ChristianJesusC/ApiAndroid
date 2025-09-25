import { UsuarioRepositoryImpl } from "./repository/UsuarioRepositoryImpl";
import { RegistrarUsuarioCasoUso } from "../application/metodosUsuarios/registrarUsuarioCasoUso";
import { LoginUsuarioCasoUso } from "../application/metodosUsuarios/loginUsuarioCasoUso";
import { ObtenerUsuariosCasoUso } from "../application/metodosUsuarios/ObtenerUsuariosCasoUso";

import { RegistrarUsuarioController } from "./controller/RegistrarUsuarioController";
import { LoginUsuarioController } from "./controller/LoginUsuarioController";
import { ObtenerUsuariosController } from "./controller/ObtenerUsuariosController";

// Repositorio (implementación concreta)
const usuarioRepository = new UsuarioRepositoryImpl();

// Casos de uso (inyección del repositorio)
const registrarUsuarioCasoUso = new RegistrarUsuarioCasoUso(usuarioRepository);
const loginUsuarioCasoUso = new LoginUsuarioCasoUso(usuarioRepository);
const obtenerUsuariosCasoUso = new ObtenerUsuariosCasoUso(usuarioRepository);

// Controladores (inyección de casos de uso)
const registrarUsuarioController = new RegistrarUsuarioController(
  registrarUsuarioCasoUso
);
const loginUsuarioController = new LoginUsuarioController(loginUsuarioCasoUso);
const obtenerUsuariosController = new ObtenerUsuariosController(
  obtenerUsuariosCasoUso
);

// Exportamos todo para usarlo en rutas u otros lugares
export {
  obtenerUsuariosController,
  registrarUsuarioController,
  loginUsuarioController,
  registrarUsuarioCasoUso,
  loginUsuarioCasoUso,
  usuarioRepository,
};
