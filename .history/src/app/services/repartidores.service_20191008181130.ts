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
        console.log('Viaje ' + viaje);
        ventasRef = this.db.list(`ventas/${fecha}/venta/${viaje}`);
      } else {
        ventasRef = this.db.list(`ventas/${fecha}/venta`);
      }
      ventasRef.valueChanges().subscribe(ventas => {
        resolve(ventas);
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
