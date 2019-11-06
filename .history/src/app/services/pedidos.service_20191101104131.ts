import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  listenPedidos() {
    return this.db.object(`pedidos/admin`).valueChanges();
  }
}
