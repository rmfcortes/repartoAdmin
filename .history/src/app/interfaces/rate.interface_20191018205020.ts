export interface ResumenRate {
    calificaciones: number;
    promedio: number;
    id: string;
    nombre: string;
    foto: string;
}

export interface Comentario {
    cliente: string;
    fecha: number;
    calificacion: Calificacion;
}

export interface Calificacion {
    comentarios: string;
    puntos: number;
    vendedor: string;
}
