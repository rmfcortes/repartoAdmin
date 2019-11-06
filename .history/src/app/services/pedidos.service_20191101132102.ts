import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Pedido } from '../interfaces/pedidos.interface';

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

  getPedidosPendientes() {
    return this.db.list('pedidos-pendientes');
  }

  getPedidosAsignados() {
    return this.db.list('pedidos-asignados');
  }

  eliminarPedido() {
    
  }
}
