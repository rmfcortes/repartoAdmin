export interface Repartidores {
    datos: DatosRepartidor;
    ubicacion: Ubicacion;
}

export interface DatosRepartidor {
    id: string;
    nombre: string;
    foto?: string;
    telefono: string;
    token: string;
}

export interface Ubicacion {
    lat: number;
    lng: number;
}
