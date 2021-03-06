import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/database';
import { Repartidores } from '../interfaces/repartidores.interface';

@Injectable({
  providedIn: 'root'
})
export class RepartidoresService {

  constructor(
    private datePipe: DatePipe,
    private db: AngularFireDatabase,
  ) { }

  getUbicaciones(): Promise<Repartidores[]> {
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
        ventasRef = this.db.list(`ventas/${idVendedor}/${fecha}/venta/${viaje}`);
      } else {
        ventasRef = this.db.list(`ventas/${idVendedor}/${fecha}/venta`);
      }
      ventasRef.valueChanges().subscribe(ventas => {
        if (viaje && viaje >= 0) {
          resolve(ventas);
        } else {
          ventas = ventas.reduce((arr, elem) => Object.assign(arr, elem));
          resolve(ventas);
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
        detallesRef = this.db.object(`ventas/${idVendedor}/${fecha}/detalles/${viaje}`);
      } else {
        detallesRef = this.db.list(`ventas/${idVendedor}/${fecha}/detalles`);
      }
      detallesRef.valueChanges().subscribe(detalles => {
        resolve(detalles);
      });
    });
  }

  getRuta(idVendedor, viaje, fecha) {
    return new Promise(async (resolve, reject) => {
      let ventasRef;
      if (!fecha) {
        fecha = await this.getFecha();
      }
      console.log('Fecha ' + fecha);
      if (viaje && viaje >= 0) {
        console.log('Viaje ' + viaje);
        ventasRef = this.db.list(`recorridos/${idVendedor}/${fecha}/venta/${viaje}`);
      } else {
        ventasRef = this.db.list(`recorridos/${idVendedor}/${fecha}/venta`);
      }
      ventasRef.valueChanges().subscribe(ventas => {
        if (viaje && viaje >= 0) {
          resolve(ventas);
        } else {
          console.log('Concatena');
          const sales = [].concat.apply([], ventas);
          resolve(sales);
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
