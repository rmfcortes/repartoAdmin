import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MapaPage } from './mapa.page';

import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { CuadroMapaComponent } from 'src/app/components/cuadro-mapa/cuadro-mapa.component';

const routes: Routes = [
  {
    path: '',
    component: MapaPage
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
  declarations: [MapaPage, CuadroMapaComponent]
})
export class MapaPageModule {}
