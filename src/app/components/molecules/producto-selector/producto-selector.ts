import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { ProductoResponseDTO } from '../../../models/model';
import { PrecioPipe } from '../../../pipes/precio.pipe';

const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

let siguienteId = 0;

@Component({
  selector: 'app-producto-selector',
  imports: [PrecioPipe],
  templateUrl: './producto-selector.html',
  styleUrl: './producto-selector.css',
})
export class ProductoSelector {
  @Input() set productos(lista: ProductoResponseDTO[]) {
    this.lista.set(lista);
  }
  @Input() seleccionado = 0;
  @Output() seleccionar = new EventEmitter<number>();

  readonly idLista = `producto-lista-${siguienteId++}`;
  private lista = signal<ProductoResponseDTO[]>([]);
  texto = signal('');
  abierto = signal(false);
  activo = signal(-1);

  readonly filtrados = computed(() => {
    const q = normalizar(this.texto().trim());
    const lista = this.lista();
    return q ? lista.filter(p => normalizar(`${p.nombre} ${p.nombreCategoria}`).includes(q)) : lista;
  });

  agotado(p: ProductoResponseDTO): boolean {
    return !p.disponibilidad || p.stock <= 0;
  }

  get valorCampo(): string {
    if (this.abierto()) return this.texto();
    return this.lista().find(p => p.idProducto === this.seleccionado)?.nombre ?? '';
  }

  abrir(): void {
    if (this.abierto()) return;
    this.texto.set('');
    this.abierto.set(true);
    this.activo.set(this.siguienteHabilitado(-1, 1));
  }

  cerrar(): void {
    this.abierto.set(false);
    this.activo.set(-1);
  }

  onInput(event: Event): void {
    this.texto.set((event.target as HTMLInputElement).value);
    this.abierto.set(true);
    this.activo.set(this.siguienteHabilitado(-1, 1));
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.abierto()) this.abrir();
        else this.activo.set(this.siguienteHabilitado(this.activo(), 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activo.set(this.siguienteHabilitado(this.activo(), -1));
        break;
      case 'Enter': {
        const p = this.filtrados()[this.activo()];
        if (this.abierto() && p) {
          event.preventDefault();
          this.elegir(p);
        }
        break;
      }
      case 'Escape':
        if (this.abierto()) {
          event.preventDefault();
          this.cerrar();
        }
        break;
    }
  }

  elegir(p: ProductoResponseDTO): void {
    if (this.agotado(p)) return;
    this.seleccionar.emit(p.idProducto);
    this.cerrar();
  }

  private siguienteHabilitado(desde: number, paso: 1 | -1): number {
    const lista = this.filtrados();
    for (let i = desde + paso; i >= 0 && i < lista.length; i += paso) {
      if (!this.agotado(lista[i])) return i;
    }
    return desde >= 0 && desde < lista.length ? desde : -1;
  }
}
