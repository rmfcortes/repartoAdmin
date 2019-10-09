import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import localeEsMX from '@angular/common/locales/es-MX';

import { IonicModule } from '@ionic/angular';

import { ClientesPage } from './clientes.page';

const routes: Routes = [
  {
    path: '',
    component: ClientesPage
  }
];

registerLocaleData(localeEsMX, 'es-MX');

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClientesPage],
  providers: [{
    provide: LOCALE_ID, useValue: 'es-MX'
  }]
})
export class ClientesPageModule {}
