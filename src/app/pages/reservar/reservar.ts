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
import { MESAS_MOCK } from '../../mocks/mesas.mock';
import { RESERVAS_MOCK } from '../../mocks/reservas.mock';
import { CLIENTES_MOCK } from '../../mocks/clientes.mock';
import { ESTADO_RESERVA } from '../../utils/estados';

// El back bloquea la mesa 2 horas antes y después de cada reserva activa.
const VENTANA_MINUTOS = 119;

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
  readonly maxPersonas = Math.max(...MESAS_MOCK.map(m => m.capacidad));
  readonly opcionesPersonas = Array.from({ length: this.maxPersonas }, (_, i) => i + 1);
  readonly estados = ESTADO_RESERVA;

  // 0 = fecha y hora, 1 = datos, 2 = confirmación.
  paso = signal(0);
  sinDisponibilidad = signal(false);
  reserva = signal<ReservaResponseDTO | null>(null);

  // Mesas libres en el orden del back (menor capacidad primero). La reserva usa la primera;
  // al conectar el back, si POST /reservas responde 409 se reintenta con la siguiente.
  private mesasDisponibles: MesaResponseDTO[] = [];

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
  }

  // Simula GET /api/reservas/disponibles: capacidad suficiente, no en mantenimiento y sin reserva
  // activa en ±2 h el mismo día; ordenadas por capacidad y número de mesa.
  verificarDisponibilidad(): void {
    const minutos = aMinutos(this.form.hora ?? '00:00');
    const bloqueadas = RESERVAS_MOCK.filter(
      r =>
        r.fecha === this.form.fecha &&
        (r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA') &&
        Math.abs(aMinutos(r.hora) - minutos) <= VENTANA_MINUTOS,
    ).map(r => r.numeroMesa);

    this.mesasDisponibles = MESAS_MOCK.filter(
      m => m.estado !== 'EN_MANTENIMIENTO' && m.capacidad >= this.form.numeroPersonas && !bloqueadas.includes(m.numeroMesa),
    ).sort((a, b) => a.capacidad - b.capacidad || a.numeroMesa - b.numeroMesa);

    if (this.mesasDisponibles.length === 0) {
      this.sinDisponibilidad.set(true);
      return;
    }
    this.form.numeroMesa = this.mesasDisponibles[0].numeroMesa;
    this.paso.set(1);
  }

  // Simula POST /api/reservas: el back reutiliza el cliente si el correo ya existe.
  confirmar(): void {
    const existente = CLIENTES_MOCK.find(c => c.correo.toLowerCase() === this.form.correo?.toLowerCase());
    const idCliente = existente?.idCliente ?? CLIENTES_MOCK.length + 1;
    const idReserva = RESERVAS_MOCK.length + 1;
    const hora = `${this.form.hora}:00`;
    this.reserva.set({
      idReservaCompuesta: `${idReserva}_${idCliente}`,
      idReserva,
      idCliente,
      nombreCliente: `${this.form.nombre} ${this.form.apellido}`,
      correoCliente: this.form.correo ?? '',
      numeroMesa: this.form.numeroMesa,
      fecha: this.form.fecha ?? '',
      hora,
      fechaHora: `${this.form.fecha}T${hora}`,
      numeroPersonas: this.form.numeroPersonas,
      estado: 'PENDIENTE',
      observaciones: this.form.observaciones ?? '',
    });
    this.paso.set(2);
  }

  nuevaReserva(): void {
    this.form = this.formVacio();
    this.reserva.set(null);
    this.sinDisponibilidad.set(false);
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
