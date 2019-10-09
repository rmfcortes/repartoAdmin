import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class RepartidoresService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  getUbicaciones() {
    return new Promise((resolve, reject) => {
      const vdSub = this.db.object(`carga`).valueChanges().subscribe(vendedores => {
        vdSub.unsubscribe();
        resolve(vendedores);
      });
    });
  }
}
