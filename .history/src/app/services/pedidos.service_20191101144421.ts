import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Pedido } from '../interfaces/pedidos.interface';
import { Repartidores } from 'src/app/interfaces/repartidores.interface';

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
    await this.db.object(`pedidos/${idChofer}/cantidad`).query.ref.transaction(count => count ? count + 1 : 1);
    await this.db.object(`pedidos/${idChofer}/detalles/${pedido.pedido.id}`).set(pedido);
    await this.db.object(`pedidos-pendientes/${pedido.pedido.id}`).remove();
  }

  async reAsignarPedido(pedido: Pedido, vendedor: Repartidores) {
    const anteriorChofer = pedido.chofer.id;
    await this.db.object(`pedidos/${anteriorChofer}/cantidad`).query.ref.transaction(count => count ? count - 1 : 1);
    await this.db.object(`pedidos/${anteriorChofer}/detalles/${pedido.pedido.id}`).remove();
    await this.db.object(`pedidos/${vendedor.datos.id}/cantidad`).query.ref.transaction(count => count ? count + 1 : 1);
    await this.db.object(`pedidos/${vendedor.datos.id}/detalles/${pedido.pedido.id}`).set(pedido);
    const chofer = {
      lat: vendedor.ubicacion.lat,
      lng: vendedor.ubicacion.lng,
      foto: vendedor.datos.foto || null,
      nombre: vendedor.datos.nombre,
      telefono: vendedor.datos.telefono,
      id: vendedor.datos.id,
    };
    await this.db.object(`usuarios/${pedido.cliente}/pedidos/${pedido.pedido.id}/chofer`).set(chofer);
  }
}
