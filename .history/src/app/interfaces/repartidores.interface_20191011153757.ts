export interface Repartidores {
    datos: DatosRepartidor;
    ubicacion: Ubicacion;
    sumario: Sumario;
    icon: string;
    display?: string;
    filtrado?: boolean;
}

export interface Sumario {
    venta: number;
    gasto: number;
    viajes: number;
    balance?: number;
    entrega?: number;
    diferencia?: number;
    valida?: string;
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
