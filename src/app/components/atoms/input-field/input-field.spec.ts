import { TestBed } from '@angular/core/testing';
import { InputField } from './input-field';

describe('InputField', () => {
  it('en un campo de contraseña el botón del ojo muestra y oculta el texto', () => {
    const fixture = TestBed.createComponent(InputField);
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const ojo: HTMLButtonElement = fixture.nativeElement.querySelector('.campo__ojo');

    expect(input.type).toBe('password');
    expect(ojo.getAttribute('aria-label')).toBe('Mostrar contraseña');

    ojo.click();
    fixture.detectChanges();
    expect(input.type).toBe('text');
    expect(ojo.getAttribute('aria-label')).toBe('Ocultar contraseña');

    ojo.click();
    fixture.detectChanges();
    expect(input.type).toBe('password');
  });

  it('los demás campos no tienen botón de ojo', () => {
    const fixture = TestBed.createComponent(InputField);
    fixture.componentRef.setInput('type', 'email');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.campo__ojo')).toBeNull();
  });
});
