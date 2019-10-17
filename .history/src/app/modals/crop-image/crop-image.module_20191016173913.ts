import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CropImagePage } from './crop-image.page';

import { ImageCroppedEvent } from 'ngx-image-cropper';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [CropImagePage],
  providers: [ImageCroppedEvent],
  entryComponents: [CropImagePage]
})
export class CropImagePageModule {}
