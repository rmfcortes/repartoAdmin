import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ResumenRate, Comentario } from '../interfaces/rate.interface';
import { Usuario } from '../interfaces/usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class RateService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  getColaboradores(): Promise<Usuario[]> {
    return new Promise((resolve, reject) => {
      const usSub = this.db.list(`repartidores`).valueChanges().subscribe((usuarios: Usuario[]) => {
        usSub.unsubscribe();
        resolve(usuarios);
      });
    });
  }

  getRates(): Promise<ResumenRate[]> {
    return new Promise((resolve, reject) => {
      const rateSub = this.db.list(`rating/resumen`).valueChanges().subscribe((rates: ResumenRate[]) => {
        rateSub.unsubscribe();
        resolve(rates);
      });
    });
  }

  getComentarios(idColaborador, batch, lastkey): Promise<Comentario[]> {
    return new Promise((resolve, reject) => {
      if (lastkey) {
        const clSub = this.db.list(`rating/comentarios/${idColaborador}`, data =>
          data.orderByKey().limitToLast(batch).endAt(lastkey))
          .valueChanges().subscribe((comentarios: Comentario[]) => {
            clSub.unsubscribe();
            resolve(comentarios);
          });
      } else {
        const clSub = this.db.list(`rating/comentarios/${idColaborador}`, data =>
          data.orderByKey().limitToLast(batch))
          .valueChanges().subscribe((comentarios: Comentario[]) => {
            clSub.unsubscribe();
            resolve(comentarios);
          });
      }
    });
  }

    // Sort

    getComentariosAltos(idColaborador, batch, lastkey, lastvalue?): Promise<Comentario[]> {
      return new Promise((resolve, reject) => {
        if (lastkey) {
          const clSub = this.db.list(`rating/comentarios/${idColaborador}`, data =>
            data.orderByChild('calificacion/puntos').limitToLast(batch).endAt(lastvalue, lastkey))
              .valueChanges().subscribe((comentarios: Comentario[]) => {
                clSub.unsubscribe();
                resolve(comentarios);
              });
        } else {
          const clSub = this.db.list(`rating/comentarios/${idColaborador}`, data =>
            data.orderByChild('calificacion/puntos').limitToLast(batch))
              .valueChanges().subscribe((comentarios: Comentario[]) => {
                clSub.unsubscribe();
                resolve(comentarios);
              });
        }
      });
    }

    getComentariosMenores(idColaborador, batch, lastkey, lastvalue): Promise<Comentario[]> {
      return new Promise((resolve, reject) => {
        if (lastkey) {
          const clSub = this.db.list(`rating/comentarios/${idColaborador}`, data =>
            data.orderByChild('calificacion/puntos').limitToFirst(batch).startAt(lastvalue, lastkey))
            .valueChanges().subscribe((comentarios: Comentario[]) => {
              clSub.unsubscribe();
              resolve(comentarios.reverse());
            });
        } else {
          const clSub = this.db.list(`rating/comentarios/${idColaborador}`, data =>
            data.orderByChild('calificacion/puntos').limitToFirst(batch))
              .valueChanges().subscribe((comentarios: Comentario[]) => {
                clSub.unsubscribe();
                resolve(comentarios.reverse());
              });
        }
      });
    }

    getComentariosRecientes(idColaborador, batch, lastkey, lastfecha): Promise<Comentario[]> {
      return new Promise((resolve, reject) => {
        if (lastkey) {
          const clSub = this.db.list(`rating/comentarios/${idColaborador}`, data =>
            data.orderByChild('fecha').limitToLast(batch).endAt(lastfecha, lastkey))
              .valueChanges().subscribe((comentarios: Comentario[]) => {
                clSub.unsubscribe();
                resolve(comentarios);
              });
        } else {
          const clSub = this.db.list(`rating/comentarios/${idColaborador}`, data =>
            data.orderByChild('fecha').limitToLast(batch))
              .valueChanges().subscribe((comentarios: Comentario[]) => {
                clSub.unsubscribe();
                resolve(comentarios);
              });
        }
      });
    }

    getComentariosAntiguos(idColaborador, batch, lastkey, lastfecha): Promise<Comentario[]> {
      return new Promise((resolve, reject) => {
        if (lastkey) {
          const clSub = this.db.list(`rating/comentarios/${idColaborador}`, data =>
            data.orderByChild('fecha').limitToFirst(batch).startAt(lastfecha, lastkey))
              .valueChanges().subscribe((comentarios: Comentario[]) => {
                clSub.unsubscribe();
                resolve(comentarios.reverse());
              });
        } else {
          const clSub = this.db.list(`rating/comentarios/${idColaborador}`, data =>
            data.orderByChild('fecha').limitToFirst(batch))
              .valueChanges().subscribe((comentarios: Comentario[]) => {
                clSub.unsubscribe();
                resolve(comentarios.reverse());
              });
        }
      });
    }
}
