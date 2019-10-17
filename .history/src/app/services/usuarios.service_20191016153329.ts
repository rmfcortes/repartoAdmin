import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Usuario } from '../interfaces/usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

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

}
