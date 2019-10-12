import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Registro } from '../interfaces/balance.interface';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  getPrimerRegistro(): Promise<string> {
    return new Promise((resolve, reject) => {
      const regSub = this.db.list(`ventas`, data => data.orderByKey().limitToFirst(1)).snapshotChanges().subscribe((primer: any) => {
        regSub.unsubscribe();
        resolve(primer[0].key);
      });
    });
  }

  getBalance(rango): Promise<Registro[]> {
    return new Promise((resolve, reject) => {
      const balSub = this.db.list(`balance`, data => data.orderByKey().startAt(rango.from.string).endAt(rango.to.string))
        .snapshotChanges().subscribe((balance) => {
          balSub.unsubscribe();
          const registros: Registro[] = [];
          balance.forEach(b => {
            const reg: Registro = {
              fecha: b.key,
              venta: 0,
              balance: 0,
              detalles: b.payload.val(),
              gasto: 0
            };
            registros.push(reg);
          });
          resolve(registros);
        });
    });
  }


}
