import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MapaPage } from './mapa.page';
import { CuadroMapaComponent } from 'src/app/components/cuadro-mapa/cuadro-mapa.component';


import { AgmCoreModule } from '@agm/core';
import { CalendarModule } from 'ion2-calendar';

import { environment } from 'src/environments/environment';

import localeEsMX from '@angular/common/locales/es-MX';

registerLocaleData(localeEsMX);

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
    CalendarModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey,
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [MapaPage, CuadroMapaComponent],
  providers: [{provide: LOCALE_ID, useValue: 'es-MX'}]
})
export class MapaPageModule {}
