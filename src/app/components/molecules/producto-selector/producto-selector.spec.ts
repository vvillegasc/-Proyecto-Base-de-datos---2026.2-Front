import { TestBed } from '@angular/core/testing';
import { ProductoResponseDTO } from '../../../models/model';
import { ProductoSelector } from './producto-selector';

const producto = (idProducto: number, nombre: string, nombreCategoria: string, stock = 10): ProductoResponseDTO => ({
  idProducto, nombre, nombreCategoria, stock, precio: 5000, disponibilidad: true, descripcion: '', imagenUrl: '',
});
const PRODUCTOS = [
  producto(1, 'Café Espresso', 'Bebidas Calientes'),
  producto(2, 'Cappuccino', 'Bebidas Calientes', 0), // agotado
  producto(3, 'Croissant', 'Repostería'),
  producto(4, 'Cafe de olla', 'Bebidas Calientes'),
];

function crear() {
  const fixture = TestBed.createComponent(ProductoSelector);
  fixture.componentRef.setInput('productos', PRODUCTOS);
  fixture.detectChanges();
  const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
  const escribir = (texto: string) => {
    input.dispatchEvent(new Event('focus'));
    input.value = texto;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
  const tecla = (key: string) => {
    input.dispatchEvent(new KeyboardEvent('keydown', { key }));
    fixture.detectChanges();
  };
  const opciones = () =>
    [...fixture.nativeElement.querySelectorAll('.selector__opcion .selector__nombre')].map(
      (e: Element) => e.firstChild!.textContent!.trim(),
    );
  return { fixture, escribir, tecla, opciones };
}

describe('ProductoSelector', () => {
  it('filtra por nombre o categoría sin importar tildes ni mayúsculas', () => {
    const { escribir, opciones } = crear();
    escribir('CAFE');
    expect(opciones()).toEqual(['Café Espresso', 'Cafe de olla']);
    escribir('reposteria');
    expect(opciones()).toEqual(['Croissant']);
  });

  it('se elige con el teclado y salta los productos agotados', () => {
    const { fixture, escribir, tecla } = crear();
    const elegido = vi.fn();
    fixture.componentInstance.seleccionar.subscribe(elegido);
    escribir('bebidas'); // Café Espresso, Cappuccino (agotado), Cafe de olla
    tecla('ArrowDown'); // salta el agotado
    tecla('Enter');
    expect(elegido).toHaveBeenCalledWith(4);
  });

  it('no deja elegir un producto agotado y avisa cuando no hay resultados', () => {
    const { fixture, escribir } = crear();
    const elegido = vi.fn();
    fixture.componentInstance.seleccionar.subscribe(elegido);
    escribir('cappuccino');
    fixture.nativeElement.querySelector('.selector__opcion').dispatchEvent(new MouseEvent('mousedown'));
    expect(elegido).not.toHaveBeenCalled();
    escribir('pizza');
    expect(fixture.nativeElement.querySelector('.selector__vacio').textContent).toContain('pizza');
  });
});
