import { Injectable, signal } from '@angular/core';
import { FacturaService } from './factura.service';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class PropinasService {
  readonly hoy = signal<number | null>(null);
  private cargadoPara: number | null = null;

  constructor(
    private facturaService: FacturaService,
    private sesion: SessionService,
  ) {}

  cargarSiHaceFalta(): void {
    const usuario = this.sesion.usuario();
    if (usuario?.idUsuario !== this.cargadoPara) this.actualizar();
  }

  actualizar(): void {
    const usuario = this.sesion.usuario();
    this.cargadoPara = usuario?.idUsuario ?? null;
    if (!usuario || usuario.rol !== 'MESERO') {
      this.hoy.set(null);
      return;
    }
    const dia = new Date().toLocaleDateString('en-CA');
    const nombre = `${usuario.nombres} ${usuario.apellidos}`.trim();
    this.facturaService.listar(dia, dia, true).subscribe({
      next: facturas =>
        this.hoy.set(facturas.filter(f => f.nombreUsuario?.trim() === nombre).reduce((t, f) => t + (f.propina ?? 0), 0)),
      error: () => this.hoy.set(null),
    });
  }
}
