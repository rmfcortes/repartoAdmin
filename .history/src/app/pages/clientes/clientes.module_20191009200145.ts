import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClientesPage } from './clientes.page';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: '',
    component: ClientesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey,
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [ClientesPage],
})
export class ClientesPageModule {}
