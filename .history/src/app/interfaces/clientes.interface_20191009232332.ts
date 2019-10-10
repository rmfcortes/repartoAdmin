export interface Cliente {
    acumulado?: number;
    cliente: string;
    direccion: Direccion;
    nombre: string;
    precio: any;
    telefono: string;
    ultimaCompra?: number;
    dias?: number;
    display?: number;
}

export interface Direccion {
    direccion: string;
    lat: number;
    lng: number;
}
