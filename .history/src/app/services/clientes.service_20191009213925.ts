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

  getClientes(): Promise<Cliente[]> {
    return new Promise((resolve, reject) => {
      this.db.list('clientes').valueChanges().subscribe((clientes: Cliente[]) => {
        resolve(clientes);
      });
    });
  }

  getProductos(): Promise<Producto[]> {
    return new Promise((resolve, reject) => {
      this.db.list('solo-lectura/productos').valueChanges().subscribe((productos: Producto[]) => {
        resolve(productos);
      });
    });
  }
}
