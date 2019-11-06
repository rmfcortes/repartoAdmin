import { Component, OnInit } from '@angular/core';

import { ProductosService } from 'src/app/services/productos.service';

import { Producto } from 'src/app/interfaces/productos.interface';
import { ModalController, AlertController } from '@ionic/angular';
import { CropImagePage } from 'src/app/modals/crop-image/crop-image.page';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  productos: Producto[] = [];
  prodsReady = false;

  iSel: number;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private productoService: ProductosService,
  ) { }

  ngOnInit() {
    this.getProductos();
  }

  async getProductos() {
    this.productos = await this.productoService.getProducto();
    this.prodsReady = true;
  }

  enfoca(i) {
    this.iSel = i;
    const input: any = document.getElementById(`foto${i}`);
    input.click();
  }

  async cropImage(imageChangedEvent) {
    const modal = await this.modalController.create({
      component: CropImagePage,
      componentProps: {imageChangedEvent}
    });
    modal.onWillDismiss().then(resp => {
      if (resp.data) {
        this.productos[this.iSel].foto = resp.data;
        const base64 = resp.data.split('data:image/png;base64,')[1];
        // this.usuarioService.guardaFotoUsuario(this.colaboradores[this.iSel], base64);
      }
    });
    return await modal.present();
  }

  editar() {
    this.presentAlertPrompt('Garrafón 20lts');
  }

  agregar() {

  }

  async presentAlertPrompt(title) {
    const alert = await this.alertController.create({
      header: title,
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          label: 'Nombre',
          placeholder: 'Nombre'
        },
        {
          name: 'precio',
          type: 'number',
          label: '$',
          placeholder: 'Precio'
        },
        {
          name: 'unidad',
          type: 'text',
          label: 'Unidades',
          placeholder: 'Unidades'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Guardar',
          handler: (value) => {
            // this.addPuesto(value.puesto);
          }
        }
      ]
    });

    await alert.present();
  }

}
