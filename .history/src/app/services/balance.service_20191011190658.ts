import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Balance } from '../interfaces/balance.interface';

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

  getBalance(rango): Promise<Balance[]> {
    return new Promise((resolve, reject) => {
      const balSub = this.db.list(`balance`, data => data.orderByKey().startAt(rango.from.string).endAt(rango.to.string))
        .valueChanges().subscribe((balance: Balance[]) => {
          resolve(balance);
        });
    });
  }


}
