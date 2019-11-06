import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Rate } from '../interfaces/rate.interface';

@Injectable({
  providedIn: 'root'
})
export class RateService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  getRates(): Promise<Rate[]> {
    return new Promise((resolve, reject) => {
      
    });
  }
}
