import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/database';
import { Repartidores } from '../interfaces/repartidores.interface';
import { Balance } from '../interfaces/balance.interface';

@Injectable({
  providedIn: 'root'
})
export class RepartidoresService {

  constructor(
    private datePipe: DatePipe,
    private db: AngularFireDatabase,
  ) { }

  getRepartidores(): Promise<Repartidores[]> {
    return new Promise((resolve, reject) => {
      const vdSub = this.db.list(`carga`).valueChanges().subscribe((vendedores: Repartidores[]) => {
        vdSub.unsubscribe();
        resolve(vendedores);
      });
    });
  }

  sigue() {
    return this.db.list('carga');
  }

  getVentas(idVendedor, viaje, fecha) {
    return new Promise(async (resolve, reject) => {
      let ventasRef;
      if (!fecha) {
        fecha = await this.getFecha();
      }
      console.log('Fecha ' + fecha);
      if (viaje && viaje >= 0) {
        ventasRef = this.db.list(`ventas/${fecha}/${idVendedor}/venta/${viaje}`);
      } else {
        ventasRef = this.db.list(`ventas/${fecha}/${idVendedor}/venta`);
      }
      const venSub = ventasRef.valueChanges().subscribe(ventas => {
        venSub.unsubscribe();
        if (ventas) {
          if (viaje && viaje >= 0) {
            resolve(ventas);
          } else {
            ventas = ventas.reduce((arr, elem) => Object.assign(arr, elem));
            resolve(ventas);
          }
        } else {
          resolve(null);
        }
      });
    });
  }

  getDetallesVenta(idVendedor, viaje, fecha) {
    return new Promise(async (resolve, reject) => {
      let detallesRef;
      if (!fecha) {
        fecha = await this.getFecha();
      }
      if (viaje && viaje >= 0) {
        detallesRef = this.db.object(`ventas/${fecha}/${idVendedor}/detalles/${viaje}`);
      } else {
        detallesRef = this.db.list(`ventas/${fecha}/${idVendedor}/detalles`);
      }
      const detSub = detallesRef.valueChanges().subscribe(detalles => {
        detSub.unsubscribe();
        if (detalles) {
          resolve(detalles);
        } else {
          resolve(null);
        }
      });
    });
  }

  getPrimerRegistro(): Promise<string> {
    return new Promise((resolve, reject) => {
      const regSub = this.db.list(`ventas`, data => data.orderByKey().limitToFirst(1)).snapshotChanges().subscribe((primer: any) => {
        regSub.unsubscribe();
        resolve(primer[0].key);
      });
    });
  }

  getBalance(dia): Promise<Balance[]> {
    return new Promise((resolve, reject) => {
      const balSub = this.db.list(`balance/${dia}`).valueChanges().subscribe((balance: Balance[]) => {
        balSub.unsubscribe();
        resolve(balance);
      });
    });
  }

  getInfoCliente(clienteId): Promise<string> {
    return new Promise((resolve, reject) => {
      const clienSub = this.db.object(`clientes/${clienteId}/nombre`).valueChanges().subscribe((nombre: string) => {
        clienSub.unsubscribe();
        resolve(nombre);
      });
    });
  }

  getRuta(idVendedor, viaje, fecha) {
    return new Promise(async (resolve, reject) => {
      let rutaRef;
      if (!fecha) {
        fecha = await this.getFecha();
      }
      if (viaje && viaje >= 0) {
        rutaRef = this.db.list(`recorridos/${idVendedor}/${fecha}/${viaje}`);
      } else {
        rutaRef = this.db.list(`recorridos/${idVendedor}/${fecha}`);
      }
      rutaRef.valueChanges().subscribe(ruta => {
        if (ruta) {
          if (viaje && viaje >= 0) {
            resolve(ruta);
          } else {
            ruta = ruta.reduce((arr, elem) => Object.assign(arr, elem));
            resolve(ruta);
          }
        } else {
          resolve (null);
        }
      });
    });
  }

  getFecha() {
    return new Promise ((resolve, reject) => {
      const date = new Date();
      const fecha = this.datePipe.transform(date, 'yyyy-MM-dd');
      resolve(fecha);
    });
  }

}
