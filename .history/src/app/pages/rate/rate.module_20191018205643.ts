import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RatePage } from './rate.page';
import { StarsComponent } from 'src/app/components/stars/stars.component';
import { ComentariosPageModule } from 'src/app/modals/comentarios/comentarios.module';

const routes: Routes = [
  {
    path: '',
    component: RatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComentariosPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RatePage, StarsComponent]
})
export class RatePageModule {}
