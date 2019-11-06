import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

import { Usuario } from '../interfaces/usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private db: AngularFireDatabase,
    private fireStorage: AngularFireStorage
  ) { }

  getCola(): Promise<Usuario[]> {
    return new Promise((resolve, reject) => {
      const usSub = this.db.list(`repartidores`).valueChanges().subscribe((usuarios: Usuario[]) => {
        usSub.unsubscribe();
        resolve(usuarios);
      });
    });
  }

  guardaFotoUsuario(idColaborador, foto) {
    return new Promise (async (resolve, reject) => {
      const ref = this.fireStorage.ref(`colaboradores/${idColaborador}`);
      const task = ref.putString( foto, 'base64', { contentType: 'image/jpeg'} );

      const p = new Promise ((resolver, rejecte) => {
        const tarea = task.snapshotChanges().pipe(
          finalize(async () => {
            const downloadURL = await ref.getDownloadURL().toPromise();
            tarea.unsubscribe();
            resolver(this.guardaDatosCompra(idColaborador, downloadURL));
          })
          ).subscribe(
            x => { console.log(x); },
            err => {
              rejecte();
              console.log(err);
            }
          );
      });
      resolve(p);
    });
  }

  guardaDatosCompra(idColaborador, url) {
    return new Promise(async (resolve, reject) => {
      await this.db.object(`repartidores/${idColaborador}/url`).set(url);
      resolve(true);
    });
  }

  getPuestos() {
    return new Promise((resolve, reject) => {
      const puesSub = this.db.object(`puestos`).valueChanges().subscribe(puestos => {
        puesSub.unsubscribe();
        resolve(Object.keys(puestos));
      });
    });
  }

  addPuesto(puesto) {
    this.db.object('puestos').update({[puesto]: true});
  }

}
