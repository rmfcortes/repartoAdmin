export interface Rate {
    calificaiones: number;
    comentarios: Comentario[];
    promedio: number;
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
