import { PedidoResponseDTO, UsuarioResponseDTO } from '../models/model';

// Datos de ejemplo para las pruebas unitarias.

export const MESERO: UsuarioResponseDTO = {
  idUsuario: 2,
  nombres: 'Carlos',
  apellidos: 'Mesero',
  correo: 'mesero@savanacoffee.com',
  rol: 'MESERO',
  estado: 'ACTIVO',
  dosFacHab: false,
  fechaInicio: '2026-10-31',
};

export const PEDIDO: PedidoResponseDTO = {
  idPedido: 1,
  idCliente: 3,
  nombreCliente: 'Laura Front',
  numeroMesa: 2,
  idUsuario: 2,
  nombreUsuario: 'Carlos Mesero',
  fecha: '2026-10-31T08:34:23.074196',
  estado: 'PENDIENTE',
  subtotal: 21500,
  observaciones: '',
  detalles: [
    { idDetallePedido: '1_1', idProducto: 1, nombreProducto: 'Café Espresso Doble', cantidad: 2, precioUnitario: 6500, subtotal: 13000 },
    { idDetallePedido: '1_4', idProducto: 4, nombreProducto: 'Croissant de Almendras', cantidad: 1, precioUnitario: 8500, subtotal: 8500 },
  ],
};
