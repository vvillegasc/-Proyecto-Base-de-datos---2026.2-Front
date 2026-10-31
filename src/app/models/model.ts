export type RolUsuario = 'ADMINISTRADOR' | 'MESERO';
export type EstadoUsuario = 'ACTIVO' | 'INACTIVO';
export type EstadoCategoria = 'ACTIVA' | 'INACTIVA';
export type EstadoMesa = 'DISPONIBLE' | 'OCUPADA' | 'RESERVADA' | 'EN_MANTENIMIENTO';
export type EstadoPedido = 'PENDIENTE' | 'EN_PREPARACION' | 'ENTREGADO' | 'CANCELADO' | 'PAGADO';
export type EstadoReserva = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';
export type EstadoFactura = 'EMITIDA' | 'ANULADA' | 'PAGADA';
export type TipoMetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';

export interface LoginRequestDTO {
  correo: string;
  contrasena: string;
}

export interface Verificar2FARequestDTO {
  correo: string;
  codigoOtp: string;
}

export interface AuthResponseDTO {
  token?: string;
  tipoToken?: string;
  requiere2FA?: boolean;
  mensaje?: string;
  usuario?: UsuarioResponseDTO;
}

export interface UsuarioRequestDTO {
  nombres: string;
  apellidos?: string;
  correo: string;
  contrasena: string;
  rol: RolUsuario;
  dosFacHab?: boolean;
  estado?: EstadoUsuario;
}

export interface UsuarioResponseDTO {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
  dosFacHab: boolean;
  fechaInicio: string;
}

export interface ActualizarEstadoUsuarioRequest {
  estado: EstadoUsuario;
}

export interface ClienteRequestDTO {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
}

export interface ClienteResponseDTO {
  idCliente: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
}

export interface EliminarClienteResponse {
  mensaje: string;
  idCliente: number;
}

export interface CategoriaRequestDTO {
  nombreCategoria: string;
  estado: EstadoCategoria;
  descripcion?: string;
}

export interface CategoriaResponseDTO {
  nombreCategoria: string;
  estado: EstadoCategoria;
  descripcion: string;
}

export interface ProductoRequestDTO {
  nombre: string;
  descripcion?: string;
  precio: number;
  disponibilidad: boolean;
  stock: number;
  imagenUrl: string;
  nombreCategoria: string;
}

export interface ProductoResponseDTO {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  disponibilidad: boolean;
  stock: number;
  imagenUrl: string;
  nombreCategoria: string;
}

export interface MesaRequestDTO {
  numeroMesa: number;
  capacidad: number;
  estado: EstadoMesa;
}

export interface MesaResponseDTO {
  numeroMesa: number;
  capacidad: number;
  estado: EstadoMesa;
}

export interface ActualizarEstadoMesaRequest {
  estado: EstadoMesa;
}

export interface DetallePedidoRequestDTO {
  idProducto: number;
  cantidad: number;
}

export interface DetallePedidoResponseDTO {
  idDetallePedido: string;
  idProducto: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoRequestDTO {
  idCliente: number;
  numeroMesa: number;
  idUsuario: number;
  observaciones?: string;
  detalles: DetallePedidoRequestDTO[];
}

export interface PedidoResponseDTO {
  idPedido: number;
  idCliente: number;
  nombreCliente: string;
  numeroMesa: number;
  idUsuario: number;
  nombreUsuario: string;
  fecha: string;
  estado: EstadoPedido;
  subtotal: number;
  observaciones: string;
  detalles: DetallePedidoResponseDTO[];
}

export interface ActualizarEstadoPedidoRequestDTO {
  nuevoEstado: EstadoPedido;
}

export interface ReservaRequestDTO {
  idReserva?: number;
  idCliente?: number;
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  numeroMesa: number;
  fecha?: string;
  hora?: string;
  fechaHora?: string;
  numeroPersonas: number;
  estado?: EstadoReserva;
}

export interface ReservaResponseDTO {
  idReservaCompuesta: string;
  idReserva: number;
  idCliente: number;
  nombreCliente: string;
  correoCliente: string;
  numeroMesa: number;
  fecha: string;
  hora: string;
  fechaHora: string;
  numeroPersonas: number;
  estado: EstadoReserva;
}

export interface ActualizarEstadoReservaRequest {
  nuevoEstado: EstadoReserva;
}

export interface MetodoPagoRequestDTO {
  tipo: TipoMetodoPago;
}

export interface MetodoPagoResponseDTO {
  tipo: TipoMetodoPago;
}

export interface PagoRequestDTO {
  tipoMetodoPago: TipoMetodoPago;
  monto: number;
}

export interface PagoResponseDTO {
  idPago: number;
  numFactura: string;
  tipoMetodoPago: TipoMetodoPago;
  estado: string;
  monto: number;
  fecha: string;
}

export interface FacturaRequestDTO {
  idPedido: number;
  propina?: number;
  pagos?: PagoRequestDTO[];
  tipoMetodoPago?: TipoMetodoPago;
  monto?: number;
}

export interface FacturaResponseDTO {
  numFactura: string;
  idPedido: number;
  nombreCliente: string;
  correoCliente: string;
  telefonoCliente: string;
  nombreUsuario: string;
  fecha: string;
  estado: EstadoFactura;
  propina: number;
  impuesto: number;
  total: number;
  pagos: PagoResponseDTO[];
}

export interface DashboardResumenDTO {
  productosActivos: number;
  mesasDisponibles: number;
  pedidosActivos: number;
  pedidosEntregadosHoy: number;
  totalVentasHoy: number;
  reservasHoy: number;
}

export interface ErrorResponseDTO {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}
