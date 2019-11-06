import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Producto } from '../interfaces/productos.interface';
@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  getProducto(): Promise<Producto[]> {
    return new Promise((resolve, reject) => {
      const prodSub = this.db.list('solo-lectura/productos').valueChanges()
        .subscribe((productos: Producto[]) => {
          prodSub.unsubscribe();
          resolve(productos);
        });
    });
  }
}
