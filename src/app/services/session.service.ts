import { Injectable, computed, signal } from '@angular/core';
import { RolUsuario, UsuarioResponseDTO } from '../models/model';

const CLAVE = 'savana.sesion';

interface Sesion {
  token: string;
  usuario: UsuarioResponseDTO;
}

export const INICIO_POR_ROL: Record<RolUsuario, string> = {
  ADMINISTRADOR: '/dashboard',
  MESERO: '/mesas',
};

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly sesion = signal<Sesion | null>(this.leer());

  readonly usuario = computed(() => this.sesion()?.usuario ?? null);
  readonly token = computed(() => this.sesion()?.token ?? null);
  readonly rol = computed(() => this.usuario()?.rol ?? null);
  readonly estaLogueado = computed(() => !!this.sesion());
  readonly esAdmin = computed(() => this.rol() === 'ADMINISTRADOR');
  readonly esMesero = computed(() => this.rol() === 'MESERO');

  iniciar(token: string, usuario: UsuarioResponseDTO): void {
    this.sesion.set({ token, usuario });
    this.guardar();
  }

  cerrar(): void {
    this.sesion.set(null);
    this.guardar();
  }

  inicio(): string {
    const rol = this.rol();
    return rol ? INICIO_POR_ROL[rol] : '/login';
  }

  private leer(): Sesion | null {
    try {
      const raw = localStorage.getItem(CLAVE);
      return raw ? (JSON.parse(raw) as Sesion) : null;
    } catch {
      return null;
    }
  }

  private guardar(): void {
    try {
      const s = this.sesion();
      if (s) localStorage.setItem(CLAVE, JSON.stringify(s));
      else localStorage.removeItem(CLAVE);
    } catch {}
  }
}
