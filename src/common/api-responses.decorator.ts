import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/** Documenta las respuestas 400 y 404 comunes. */
export const ApiErrores = (opciones: { badRequest?: string; notFound?: string } = {}) =>
  applyDecorators(
    ApiBadRequestResponse({
      description:
        opciones.badRequest ?? 'Datos inválidos o el id no es un número (400)',
    }),
    ApiNotFoundResponse({
      description: opciones.notFound ?? 'El recurso no existe (404)',
    }),
  );

/** Protege el endpoint con JWT y lo documenta con el candado de Scalar. */
export const Protegido = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Token no enviado o inválido (401)' }),
  );
