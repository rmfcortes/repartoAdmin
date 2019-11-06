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
  verPrevio = false;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  guardar() {
    this.modalCtrl.dismiss(this.croppedImage);
  }

  salir() {
    this.modalCtrl.dismiss();
  }

}
