export type RolUsuario = 'ADMINISTRADOR' | 'EMPLEADO';
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
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
}

export interface ClienteResponseDTO {
  idCliente: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  fechaRegistro: string;
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
  idDetallePedido: number;
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
  idCliente?: number;
  nombres?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
  numeroMesa: number;
  fecha?: string;
  hora?: string;
  fechaHora?: string;
  numeroPersonas: number;
  estado?: EstadoReserva;
  observaciones?: string;
}

export interface ReservaResponseDTO {
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
  observaciones: string;
}

export interface ActualizarEstadoReservaRequest {
  nuevoEstado: EstadoReserva;
}

export interface MetodoPagoRequestDTO {
  tipo: TipoMetodoPago;
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}

export interface MetodoPagoResponseDTO {
  tipo: TipoMetodoPago;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface PagoRequestDTO {
  tipoMetodoPago: TipoMetodoPago;
  total: number;
  referenciaTransaccion?: string;
}

export interface PagoResponseDTO {
  idPago: number;
  numFactura: string;
  tipoMetodoPago: TipoMetodoPago;
  nombreMetodoPago: string;
  estado: string;
  total: number;
  referenciaTransaccion: string;
  fecha: string;
}

export interface FacturaRequestDTO {
  idPedido: number;
  idUsuario?: number;
  propina?: number;
  pagos?: PagoRequestDTO[];
  tipoMetodoPago?: TipoMetodoPago;
  total?: number;
  referenciaTransaccion?: string;
}

export interface FacturaResponseDTO {
  numFactura: string;
  idPedido: number;
  idCliente: number;
  nombreCliente: string;
  correoCliente: string;
  telefonoCliente: string;
  idUsuario: number;
  nombreUsuario: string;
  fecha: string;
  estado: EstadoFactura;
  subtotal: number;
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
