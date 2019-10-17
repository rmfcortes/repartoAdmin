import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.page.html',
  styleUrls: ['./crop-image.page.scss'],
})
export class CropImagePage implements OnInit {

  @Input() imageChangedEvent;

  croppedImage: any = '';
  cargando = true;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }

  cropperReady() {
    this.cargando = false;
  }

  regresar() {
    this.modalCtrl.dismiss(this.croppedImage);
  }

}
