import { Direccion } from './clientes.interface';
import { Producto } from '../../../.history/src/app/interfaces/productos.interface_20191018145400';

export interface Pedido {
    cliente: string;
    chofer?: string;
    detalles: DetallesPedido;
}

export interface DetallesPedido {
    createdAt: number;
    direccion: Direccion;
    id: string;
    productos: Producto[];
    token: string;
    usuario: string;
}

export interface Producto {
    cantidad: number;
    id: string;
    nombre: string;
}
