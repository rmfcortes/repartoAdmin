import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductosPage } from './productos.page';
import { PreloadImageComponent } from 'src/app/components/pre-load-image/pre-load-image.component';
import { CropImagePageModule } from 'src/app/modals/crop-image/crop-image.module';

const routes: Routes = [
  {
    path: '',
    component: ProductosPage
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
  declarations: [ProductosPage, PreloadImageComponent]
})
export class ProductosPageModule {}
