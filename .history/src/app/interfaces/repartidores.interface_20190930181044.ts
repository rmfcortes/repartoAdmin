export interface Repartidores {
    datos: Datos;
    ubicacion: Ubicacion;
}

export interface Datos {
    nombre: string;
    foto?: string;
    telefono: string;
    token: string;
}

export interface Ubicacion {
    lat: number;
    lng: number;
}
