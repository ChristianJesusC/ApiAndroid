# 🎮 API de Videojuegos - CI/CD Project

## 📋 Descripción

API RESTful para gestión de videojuegos con:
- Autenticación JWT
- Notificaciones Push (Firebase)
- Gestión de usuarios y juegos
- CI/CD automatizado con GitHub Actions

## 🚀 Tecnologías

- Node.js + TypeScript + Express
- MySQL 8.0
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- AWS EC2

## 🏗️ Arquitectura

Sistema desplegado en AWS EC2 con:
- Contenedor Node.js (API)
- Contenedor MySQL (Base de datos)
- Pipeline CI/CD automatizado

## 📝 Endpoints

### Usuarios
- POST `/usuarios/registrar` - Registrar usuario
- POST `/usuarios/login` - Login
- GET `/usuarios/obtenerTodos` - Listar usuarios

### Juegos
- POST `/juegos` - Crear juego (requiere auth)
- GET `/juegos` - Listar juegos
- PUT `/juegos/:id` - Actualizar juego (requiere auth)
- DELETE `/juegos/:id` - Eliminar juego (requiere auth)

### Notificaciones
- POST `/notifications/device-token` - Registrar token
- POST `/notifications/test` - Enviar prueba
- GET `/notifications/tokens` - Ver tokens

## 🔧 Variables de Entorno

Ver archivo `.env.example` para configuración.

## 🚀 Despliegue

El despliegue es automático al hacer merge a `develop`.
