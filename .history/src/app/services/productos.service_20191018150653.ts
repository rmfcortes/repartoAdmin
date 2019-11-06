import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

import { Producto } from '../interfaces/productos.interface';
@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(
    private db: AngularFireDatabase,
    private fireStorage: AngularFireStorage,
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

  saveFotoProducto(producto: Producto, foto: string) {
    return new Promise (async (resolve, reject) => {
      if (!producto.id) {
        producto.id = await this.db.createPushId();
      }
      const ref = this.fireStorage.ref(`productos/${producto.id}`);
      const task = ref.putString( foto, 'base64', { contentType: 'image/jpeg'} );

      const p = new Promise ((resolver, rejecte) => {
        const tarea = task.snapshotChanges().pipe(
          finalize(async () => {
            const downloadURL = await ref.getDownloadURL().toPromise();
            tarea.unsubscribe();
            producto.foto = downloadURL;
            resolver(this.saveProducto(producto));
          })
          ).subscribe(
            x => { console.log(x); },
            err => {
              rejecte(err);
            }
          );
      });
      resolve(p);
    });
  }

  saveProducto(producto: Producto) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!producto.id) {
          producto.id = this.db.createPushId();
        }
        await this.db.object(`solo-lectura/productos/${producto.id}`).update(producto);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  borraFoto(foto: string) {
    return this.fireStorage.storage.refFromURL(foto).delete();
  }

}
