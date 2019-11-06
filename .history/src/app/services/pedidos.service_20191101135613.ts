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

  async asignarPedido(pedido, idChofer) {
    await this.db.object(`pedidos-pendientes/${pedido.pedido.id}/chofer`).set(idChofer);
    await this.db.object(`pedidos/${idChofer}/cantidad`).query.ref.transaction(count => count ? count += 1 : 1);
    await this.db.object(`pedidos/${idChofer}/detalles/${pedido.pedido.id}`).set(pedido);
    await this.db.object(`pedidos-pendientes/${pedido.pedido.id}`).remove();
  }
}
