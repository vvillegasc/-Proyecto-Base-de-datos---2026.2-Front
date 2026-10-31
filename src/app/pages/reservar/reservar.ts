import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicLayout } from '../../components/templates/public-layout/public-layout';
import { Stepper } from '../../components/molecules/stepper/stepper';
import { FormField } from '../../components/molecules/form-field/form-field';
import { TextareaField } from '../../components/molecules/textarea-field/textarea-field';
import { Badge } from '../../components/atoms/badge/badge';
import { Button } from '../../components/atoms/button/button';
import { MesaResponseDTO, ReservaRequestDTO, ReservaResponseDTO } from '../../models/model';
import { ReservaService } from '../../services/reserva.service';
import { mensajeDeError } from '../../interceptors/error.interceptor';
import { HttpErrorResponse } from '@angular/common/http';
import { ESTADO_RESERVA } from '../../utils/estados';

// El cliente no puede consultar las mesas: si no hay ninguna para ese número de personas,
// el back simplemente no devuelve disponibilidad.
const MAX_PERSONAS = 10;

const aMinutos = (hora: string) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

@Component({
  selector: 'app-reservar',
  imports: [PublicLayout, Stepper, FormField, TextareaField, Badge, Button, DatePipe, RouterLink],
  templateUrl: './reservar.html',
  styleUrl: './reservar.css',
})
export class Reservar {
  readonly pasos = ['Fecha y hora', 'Tus datos'];
  readonly hoy = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD en hora local
  readonly opcionesPersonas = Array.from({ length: MAX_PERSONAS }, (_, i) => i + 1);
  readonly estados = ESTADO_RESERVA;

  // 0 = fecha y hora, 1 = datos, 2 = confirmación.
  paso = signal(0);
  sinDisponibilidad = signal(false);
  cargando = signal(false);
  error = signal('');
  reserva = signal<ReservaResponseDTO | null>(null);

  // Mesas libres en el orden del back (menor capacidad primero). La reserva usa la primera;
  // si POST /reservas responde 409 (otro cliente la tomó), se reintenta con la siguiente.
  private mesasDisponibles: MesaResponseDTO[] = [];

  constructor(private reservaService: ReservaService) {}

  form: ReservaRequestDTO = this.formVacio();

  get horaPasada(): boolean {
    if (this.form.fecha !== this.hoy || !this.form.hora) return false;
    const ahora = new Date();
    return aMinutos(this.form.hora) <= ahora.getHours() * 60 + ahora.getMinutes();
  }

  get paso1Completo(): boolean {
    return !!(this.form.fecha && this.form.hora && this.form.numeroPersonas) && !this.horaPasada;
  }

  get paso2Completo(): boolean {
    return !!(this.form.nombre && this.form.apellido && this.form.correo && this.form.telefono);
  }

  cambiarCriterio(campo: 'fecha' | 'hora' | 'numeroPersonas', valor: string): void {
    if (campo === 'numeroPersonas') this.form.numeroPersonas = +valor;
    else this.form[campo] = valor;
    this.sinDisponibilidad.set(false);
    this.error.set('');
  }

  // GET /reservas/disponibles: ya excluye mesas sin capacidad, en mantenimiento o con reserva en ±2 h.
  verificarDisponibilidad(): void {
    this.cargando.set(true);
    this.error.set('');
    this.reservaService.disponibles(this.fechaHora, this.form.numeroPersonas).subscribe({
      next: mesas => {
        this.cargando.set(false);
        this.mesasDisponibles = mesas;
        if (mesas.length === 0) {
          this.sinDisponibilidad.set(true);
          return;
        }
        this.paso.set(1);
      },
      error: err => {
        this.cargando.set(false);
        this.error.set(mensajeDeError(err));
      },
    });
  }

  confirmar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.intentarReservar(0);
  }

  private intentarReservar(indice: number): void {
    const mesa = this.mesasDisponibles[indice];
    if (!mesa) {
      // Se ocuparon todas mientras el cliente llenaba sus datos.
      this.cargando.set(false);
      this.sinDisponibilidad.set(true);
      this.paso.set(0);
      return;
    }
    this.reservaService
      .crear({ ...this.form, numeroMesa: mesa.numeroMesa, hora: `${this.form.hora}:00` })
      .subscribe({
        next: reserva => {
          this.cargando.set(false);
          this.reserva.set(reserva);
          this.paso.set(2);
        },
        error: err => {
          if (err instanceof HttpErrorResponse && err.status === 409) {
            this.intentarReservar(indice + 1);
          } else {
            this.cargando.set(false);
            this.error.set(mensajeDeError(err));
          }
        },
      });
  }

  private get fechaHora(): string {
    return `${this.form.fecha}T${this.form.hora}:00`;
  }

  nuevaReserva(): void {
    this.form = this.formVacio();
    this.reserva.set(null);
    this.sinDisponibilidad.set(false);
    this.error.set('');
    this.paso.set(0);
  }

  private formVacio(): ReservaRequestDTO {
    return {
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      numeroMesa: 0,
      fecha: '',
      hora: '',
      numeroPersonas: 2,
      observaciones: '',
    };
  }
}
