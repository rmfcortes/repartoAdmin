export interface Balance {
    balance: number;
    diferencia: number;
    entrega: number;
    gasto: number;
    id: string;
    valida: string;
    venta: number;
    viajes: number;
    recorrido?: number;
    nombre?: string;
    foto?: string;
    display?: string;
}

export interface Registro {
    balance: number;
    fecha: string;
    venta: number;
    gasto: number;
    detalles: any;
}
