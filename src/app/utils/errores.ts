import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDTO } from '../models/model';

export type ErroresCampo = Record<string, string>;

export function erroresDeCampo(err: unknown): ErroresCampo {
  if (!(err instanceof HttpErrorResponse) || err.status !== 400) return {};
  return (err.error as Partial<ErrorResponseDTO> | null)?.validationErrors ?? {};
}
