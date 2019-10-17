import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UsuariosPage } from './usuarios.page';
import { CropImagePageModule } from 'src/app/modals/crop-image/crop-image.module';

const routes: Routes = [
  {
    path: '',
    component: UsuariosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CropImagePageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UsuariosPage]
})
export class UsuariosPageModule {}
