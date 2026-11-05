import { HttpContext, HttpContextToken } from '@angular/common/http';

export const ERROR_MANEJADO = new HttpContextToken<boolean>(() => false);

export const errorManejado = () => new HttpContext().set(ERROR_MANEJADO, true);
