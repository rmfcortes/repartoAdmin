import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ResumenRate } from '../interfaces/rate.interface';
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
}
