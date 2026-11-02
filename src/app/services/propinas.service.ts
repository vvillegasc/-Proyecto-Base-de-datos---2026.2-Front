import { Injectable, signal } from '@angular/core';
import { FacturaService } from './factura.service';
import { SessionService } from './session.service';

/**
 * Propinas de hoy del mesero que inició sesión (se muestran en el menú izquierdo).
 * Las facturas del back no traen el idUsuario, solo `nombreUsuario`: se comparan por nombre completo.
 */
@Injectable({ providedIn: 'root' })
export class PropinasService {
  // null = todavía no se sabe (o no aplica: el admin no cobra).
  readonly hoy = signal<number | null>(null);
  private cargadoPara: number | null = null;

  constructor(
    private facturaService: FacturaService,
    private sesion: SessionService,
  ) {}

  // Solo consulta si cambió el usuario (el menú se vuelve a crear en cada pantalla).
  cargarSiHaceFalta(): void {
    const usuario = this.sesion.usuario();
    if (usuario?.idUsuario !== this.cargadoPara) this.actualizar();
  }

  // Después de un cobro, para que la cifra se actualice al momento.
  actualizar(): void {
    const usuario = this.sesion.usuario();
    this.cargadoPara = usuario?.idUsuario ?? null;
    if (!usuario || usuario.rol !== 'MESERO') {
      this.hoy.set(null);
      return;
    }
    const dia = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD en hora local
    const nombre = `${usuario.nombres} ${usuario.apellidos}`.trim();
    this.facturaService.listar(dia, dia, true).subscribe({
      next: facturas =>
        this.hoy.set(facturas.filter(f => f.nombreUsuario?.trim() === nombre).reduce((t, f) => t + (f.propina ?? 0), 0)),
      error: () => this.hoy.set(null),
    });
  }
}
