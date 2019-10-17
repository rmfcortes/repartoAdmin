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

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  // fileChangeEvent(event: any): void {
  //   this.imageChangedEvent = event;
  // }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }

  imageLoaded() {
      // show cropper
  }

  cropperReady() {
      // cropper ready
  }

  loadImageFailed() {
      // show message
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
