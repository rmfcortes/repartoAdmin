import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Repartidores } from '../interfaces/repartidores.interface';

@Injectable({
  providedIn: 'root'
})
export class RepartidoresService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  getUbicaciones(): Promise<Repartidores[]> {
    return new Promise((resolve, reject) => {
      const vdSub = this.db.list(`carga`).valueChanges().subscribe((vendedores: Repartidores[]) => {
        vdSub.unsubscribe();
        resolve(vendedores);
      });
    });
  }
}
