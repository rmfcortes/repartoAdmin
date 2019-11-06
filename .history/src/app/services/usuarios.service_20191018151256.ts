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
    private fireStorage: AngularFireStorage,
  ) { }

  getCola(): Promise<Usuario[]> {
    return new Promise((resolve, reject) => {
      const usSub = this.db.list(`repartidores`).valueChanges().subscribe((usuarios: Usuario[]) => {
        usSub.unsubscribe();
        resolve(usuarios);
      });
    });
  }

  guardaFotoUsuario(colaborador: Usuario, foto: string) {
    return new Promise (async (resolve, reject) => {
      if (!colaborador.id) {
        colaborador.id = await this.db.createPushId();
      }
      const ref = this.fireStorage.ref(`colaboradores/${colaborador.id}`);
      const task = ref.putString( foto, 'base64', { contentType: 'image/jpeg'} );

      const p = new Promise ((resolver, rejecte) => {
        const tarea = task.snapshotChanges().pipe(
          finalize(async () => {
            const downloadURL = await ref.getDownloadURL().toPromise();
            tarea.unsubscribe();
            colaborador.url = downloadURL;
            resolver(this.updateUsuario(colaborador));
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

  borraFoto(foto: string) {
    return this.fireStorage.storage.refFromURL(foto).delete();
  }

  async updateUsuario(colaborador: Usuario) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!colaborador.id) {
          await this.db.list('nuevoColaborador').push(colaborador);
        } else {
          await this.db.object(`repartidores/${colaborador.id}`).update(colaborador);
        }
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async updatePermisos(colaborador: Usuario) {
    if (colaborador.permisos) {
      await this.db.object(`solo-lectura/pass-supervisores`).update({[colaborador.password]: true});
    } else {
      await this.db.object(`solo-lectura/pass-supervisores/${colaborador.password}`).remove();
    }
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

  getCreateUserResult() {
    return this.db.object('result');
  }

  cleanResult() {
    this.db.object('result').remove();
  }



}
