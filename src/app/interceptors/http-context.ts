import { HttpContext, HttpContextToken } from '@angular/common/http';

// Marca una petición para que el interceptor de errores NO muestre el toast (la pantalla maneja el error).
export const ERROR_MANEJADO = new HttpContextToken<boolean>(() => false);

export const errorManejado = () => new HttpContext().set(ERROR_MANEJADO, true);
