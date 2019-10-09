import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClientesPage } from './clientes.page';
import { PopComponent } from 'src/app/components/pop/pop.component';
import { PopComponentModule } from 'src/app/components/pop/pop.module';

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
    PopComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClientesPage],
})
export class ClientesPageModule {}
