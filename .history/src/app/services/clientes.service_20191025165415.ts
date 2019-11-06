import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Cliente } from '../interfaces/clientes.interface';
import { Producto } from '../interfaces/productos.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(
    private db: AngularFireDatabase
  ) { }

  getClientes(batch, lastkey): Promise<Cliente[]> {
    return new Promise((resolve, reject) => {
      if (lastkey) {
        const clSub = this.db.list('clientes', data => data.orderByKey().limitToLast(batch).endAt(lastkey))
        .valueChanges().subscribe((clientes: Cliente[]) => {
          clSub.unsubscribe();
          resolve(clientes);
        });
      } else {
        const clSub = this.db.list('clientes', data => data.orderByKey().limitToLast(batch))
          .valueChanges().subscribe((clientes: Cliente[]) => {
            clSub.unsubscribe();
            resolve(clientes);
          });
      }
    });
  }

  getProductos(): Promise<Producto[]> {
    return new Promise((resolve, reject) => {
      const prodSub = this.db.list('solo-lectura/productos').valueChanges().subscribe((productos: Producto[]) => {
        prodSub.unsubscribe();
        resolve(productos);
      });
    });
  }

  guardaPrecio(clienteId, precios) {
    return this.db.object(`clientes/${clienteId}/precio`).update(precios);
  }

  buscaCliente(texto) {
    return new Promise((resolve, reject) => {
      const bsSub = this.db.list(`busqueda/clientes`, data => data.orderByKey().startAt(texto).endAt(texto + '\uf8ff'))
        .valueChanges().subscribe(clientes => {
          bsSub.unsubscribe();
          resolve(clientes);
        });
    });
  }

  getCliente(clienteId): Promise<Cliente> {
    return new Promise((resolve, reject) => {
      const clienSub = this.db.object(`clientes/${clienteId}/precio`).valueChanges().subscribe((cliente: Cliente) => {
        clienSub.unsubscribe();
        resolve(cliente);
      });
    });
  }

}
