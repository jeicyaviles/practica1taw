# Práctica TAW-251 – Sistema de Gestión de Cine

API REST para administrar salas, películas, géneros, funciones, clientes y la venta de boletos.

**Stack:** NestJS · TypeORM · MySQL (XAMPP) · class-validator · Scalar (documentación) · JWT (extra)

## Arquitectura

N-capas: `Controller → Service → Repository (TypeORM)`. Cada entidad tiene su propio módulo
(controller, service, entity y DTOs). La tabla `pelicula_genero` no tiene entidad ni módulo:
la genera TypeORM con `@ManyToMany` + `@JoinTable` y se maneja desde el módulo de Películas.

```
src/
├── auth/        (extra) registro, login, guard JWT
├── boletos/     tabla intermedia manual Funcion <-> Cliente
├── clientes/
├── common/      decoradores reutilizables para Scalar y el guard
├── funciones/
├── generos/
├── peliculas/   incluye asignar/quitar géneros
├── salas/
├── app.module.ts
└── main.ts      ValidationPipe + Scalar
```

## Relaciones implementadas

| Tipo | Entidades | Implementación |
|------|-----------|----------------|
| 1 a N | Sala → Función | `@OneToMany` / `@ManyToOne` + `@JoinColumn` |
| 1 a N | Película → Función | `@OneToMany` / `@ManyToOne` + `@JoinColumn` |
| N a M automática | Película ↔ Género | `@ManyToMany` + `@JoinTable` (TypeORM crea `pelicula_genero`) |
| N a M a mano | Función ↔ Cliente | Entidad `Boleto` con dos `@ManyToOne` + `numeroAsiento` y `precioPagado` |

Todas las entidades tienen `creadoEn`, `actualizadoEn` y `eliminadoEn`
(`@CreateDateColumn`, `@UpdateDateColumn`, `@DeleteDateColumn`). Los `DELETE` hacen borrado lógico (`softDelete`).

## Requisitos

- Node.js 20 o superior
- XAMPP con MySQL/MariaDB (módulo MySQL iniciado)

## Cómo correr el proyecto localmente

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Iniciar MySQL en XAMPP y crear la base de datos**

   - Abre el Panel de Control de XAMPP y presiona **Start** en el módulo **MySQL**.
   - Entra a http://localhost/phpmyadmin y crea una base de datos llamada `cine_db`
     (cotejamiento `utf8mb4_general_ci`), o ejecuta en la pestaña SQL:

     ```sql
     CREATE DATABASE cine_db CHARACTER SET utf8mb4;
     ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Por defecto XAMPP usa usuario `root` sin contraseña, y el `.env.example` ya viene así
   (`DB_HOST=localhost`, `DB_PORT=3306`, `DB_USERNAME=root`, `DB_PASSWORD=` vacío, `DB_NAME=cine_db`).
   Si cambiaste la contraseña de root o el puerto de MySQL, edita `.env`.

4. **Iniciar la aplicación**

   ```bash
   npm run start:dev
   ```

   Las tablas se crean automáticamente (`synchronize: true`, pensado para desarrollo/práctica).

5. **Abrir la documentación**

   - API: http://localhost:3000
   - Scalar: http://localhost:3000/docs

## Endpoints

| Módulo | Rutas |
|--------|-------|
| Salas | `GET /salas`, `GET /salas/:id`, `POST /salas`, `PATCH /salas/:id`, `DELETE /salas/:id` |
| Géneros | `GET /generos`, `GET /generos/:id`, `POST /generos`, `PATCH /generos/:id`, `DELETE /generos/:id` |
| Películas | `GET /peliculas`, `GET /peliculas/:id`, `POST /peliculas`, `PATCH /peliculas/:id`, `DELETE /peliculas/:id`, `POST /peliculas/:id/generos`, `DELETE /peliculas/:id/generos/:idGenero` |
| Funciones | `GET /funciones`, `GET /funciones/:id`, `POST /funciones`, `PATCH /funciones/:id`, `DELETE /funciones/:id` |
| Clientes | `GET /clientes`, `GET /clientes/:id`, `POST /clientes`, `PATCH /clientes/:id`, `DELETE /clientes/:id` |
| Boletos | `GET /boletos`, `GET /boletos/:id`, `POST /boletos`, `PATCH /boletos/:id`, `DELETE /boletos/:id` |
| Auth (extra) | `POST /auth/register`, `POST /auth/login` |

## Reglas de negocio (boletos)

- No se puede vender el mismo `numeroAsiento` dos veces para la misma función → `400 BadRequestException`.
- `numeroAsiento` debe estar entre 1 y la capacidad de la sala de la función → `400 BadRequestException`.
- Si no se envía `precioPagado`, se guarda el precio de la función.
- Las mismas reglas se validan en `PATCH /boletos/:id`.
- Al anular un boleto (soft delete) el asiento queda disponible nuevamente.

## Manejo de errores

- `404 NotFoundException` si un recurso no existe, incluidas las llaves foráneas del body
  (`idSala`, `idPelicula`, `idGeneros`, `idFuncion`, `idCliente`). Ej.: `"La función con id 7 no existe"`.
- `400 BadRequestException` cuando no se cumple una regla de negocio.
- `400` si el body no cumple las validaciones de `class-validator` o el `:id` no es numérico (`ParseIntPipe`).

## Autenticación JWT (extra)

Los `GET` son públicos; `POST`, `PATCH` y `DELETE` requieren token (si falta o es inválido → `401`).

1. Registrar usuario: `POST /auth/register`

   ```json
   { "username": "admin", "email": "admin@cine.com", "password": "Secreta123" }
   ```

2. Iniciar sesión: `POST /auth/login` → devuelve `{ "access_token": "..." }`
3. En Scalar, agrega el token en la sección de autenticación (Bearer) para probar los endpoints protegidos,
   o envía el header `Authorization: Bearer <access_token>`.

## Ejemplo de flujo rápido

```text
POST /auth/register          → crear usuario
POST /auth/login             → obtener token
POST /salas                  { "nombre": "Sala 1", "capacidad": 80, "tipo": "IMAX" }
POST /generos                { "nombre": "Acción" }
POST /peliculas              { "titulo": "Interestelar", "duracionMin": 169, "clasificacion": "+13", "idGeneros": [1] }
POST /funciones              { "idSala": 1, "idPelicula": 1, "fechaHora": "2026-11-20T19:30:00", "precio": 35.5 }
POST /clientes               { "nombres": "Juan", "paterno": "Pérez", "email": "juan@email.com" }
POST /boletos                { "idFuncion": 1, "idCliente": 1, "numeroAsiento": 15 }
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Modo desarrollo con recarga |
| `npm run build` | Compila a `dist/` |
| `npm run start:prod` | Ejecuta la versión compilada |
