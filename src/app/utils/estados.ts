import { BadgeVariant } from '../components/atoms/badge/badge';
import {
  EstadoCategoria,
  EstadoFactura,
  EstadoMesa,
  EstadoPedido,
  EstadoReserva,
  EstadoUsuario,
} from '../models/model';

export interface EstadoVisual {
  label: string;
  variant: BadgeVariant;
}

// Texto y color del badge para cada estado; usar siempre estos mapas para que todo se vea igual.
export const ESTADO_MESA: Record<EstadoMesa, EstadoVisual> = {
  DISPONIBLE: { label: 'Disponible', variant: 'success' },
  OCUPADA: { label: 'Ocupada', variant: 'danger' },
  RESERVADA: { label: 'Reservada', variant: 'warning' },
  EN_MANTENIMIENTO: { label: 'Mantenimiento', variant: 'neutral' },
};

export const ESTADO_PEDIDO: Record<EstadoPedido, EstadoVisual> = {
  PENDIENTE: { label: 'Pendiente', variant: 'warning' },
  EN_PREPARACION: { label: 'En prep.', variant: 'info' },
  ENTREGADO: { label: 'Entregado', variant: 'success' },
  PAGADO: { label: 'Pagado', variant: 'neutral' },
  CANCELADO: { label: 'Cancelado', variant: 'danger' },
};

export const ESTADO_RESERVA: Record<EstadoReserva, EstadoVisual> = {
  PENDIENTE: { label: 'Pendiente', variant: 'warning' },
  CONFIRMADA: { label: 'Confirmada', variant: 'info' },
  COMPLETADA: { label: 'Completada', variant: 'success' },
  CANCELADA: { label: 'Cancelada', variant: 'danger' },
};

export const ESTADO_FACTURA: Record<EstadoFactura, EstadoVisual> = {
  EMITIDA: { label: 'Emitida', variant: 'info' },
  PAGADA: { label: 'Pagada', variant: 'success' },
  ANULADA: { label: 'Anulada', variant: 'danger' },
};

export const ESTADO_USUARIO: Record<EstadoUsuario, EstadoVisual> = {
  ACTIVO: { label: 'Activo', variant: 'success' },
  INACTIVO: { label: 'Inactivo', variant: 'neutral' },
};

export const ESTADO_CATEGORIA: Record<EstadoCategoria, EstadoVisual> = {
  ACTIVA: { label: 'Activa', variant: 'success' },
  INACTIVA: { label: 'Inactiva', variant: 'neutral' },
};

export const DISPONIBILIDAD_PRODUCTO = {
  disponible: { label: 'Disponible', variant: 'success' },
  agotado: { label: 'Agotado', variant: 'danger' },
} satisfies Record<string, EstadoVisual>;
