import { HttpErrorResponse } from '@angular/common/http';
import { erroresDeCampo } from './errores';

describe('erroresDeCampo', () => {
  it('devuelve los errores por campo de un 400 del back', () => {
    const err = new HttpErrorResponse({
      status: 400,
      error: { validationErrors: { correo: 'El formato del correo electrónico no es válido' } },
    });
    expect(erroresDeCampo(err)).toEqual({ correo: 'El formato del correo electrónico no es válido' });
  });

  it('devuelve vacío si no es un 400 o no trae validationErrors', () => {
    expect(erroresDeCampo(new HttpErrorResponse({ status: 409, error: { message: 'Conflicto' } }))).toEqual({});
    expect(erroresDeCampo(new HttpErrorResponse({ status: 400, error: { message: 'Mala petición' } }))).toEqual({});
    expect(erroresDeCampo(new Error('otro'))).toEqual({});
  });
});
