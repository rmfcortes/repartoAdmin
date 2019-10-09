import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Cliente } from '../interfaces/clientes.interface';

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
}
