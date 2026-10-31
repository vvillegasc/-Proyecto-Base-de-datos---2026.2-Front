import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorResponseDTO } from '../models/model';
import { SessionService } from '../services/session.service';
import { ToastService } from '../services/toast.service';
import { ERROR_MANEJADO } from './http-context';
import { erroresDeCampo } from '../utils/errores';

/** Convierte cualquier error HTTP en un mensaje legible (usa el ErrorResponseDTO del back). */
export function mensajeDeError(err: unknown): string {
  if (!(err instanceof HttpErrorResponse)) return 'Ocurrió un error inesperado.';
  if (err.status === 0) return 'No se pudo conectar con el servidor. ¿Está corriendo el back?';
  const body = err.error as Partial<ErrorResponseDTO> | null;
  const detalles = body?.validationErrors ? Object.values(body.validationErrors) : [];
  if (detalles.length) return detalles.join(' · ');
  if (err.status === 403) return 'No tienes permiso para esta acción.';
  return body?.message || `Error ${err.status}`;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const sesion = inject(SessionService);
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      const esAuth = req.url.includes('/auth/');
      if (err instanceof HttpErrorResponse && err.status === 401 && !esAuth) {
        // Token vencido o inválido: se cierra la sesión.
        sesion.cerrar();
        router.navigate(['/login']);
        toast.show('Tu sesión expiró. Inicia sesión de nuevo.', 'error');
      } else if (!req.context.get(ERROR_MANEJADO)) {
        // Si hay errores por campo, el formulario los muestra debajo de cada uno: el aviso solo lo indica.
        const porCampo = Object.keys(erroresDeCampo(err)).length > 0;
        toast.show(porCampo ? 'Revisa los campos marcados en rojo.' : mensajeDeError(err), 'error');
      }
      return throwError(() => err);
    }),
  );
};
