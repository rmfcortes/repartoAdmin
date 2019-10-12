import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BalancePage } from './balance.page';

import { CalendarModule } from 'ion2-calendar';

import localeEsMX from '@angular/common/locales/es-MX';
registerLocaleData(localeEsMX);


const routes: Routes = [
  {
    path: '',
    component: BalancePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BalancePage],
  providers: [{provide: LOCALE_ID, useValue: 'es-MX'}]
})
export class BalancePageModule {}
