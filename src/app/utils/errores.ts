import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDTO } from '../models/model';

export type ErroresCampo = Record<string, string>;

/**
 * Errores de validación por campo que manda el back en un 400 (`validationErrors`),
 * ej. { correo: 'El formato del correo electrónico no es válido' }. Vacío si no hay.
 */
export function erroresDeCampo(err: unknown): ErroresCampo {
  if (!(err instanceof HttpErrorResponse) || err.status !== 400) return {};
  return (err.error as Partial<ErrorResponseDTO> | null)?.validationErrors ?? {};
}
