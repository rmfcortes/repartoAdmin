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
  base64: string;
  foto: string;

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

  async cropImage(imageChangedEvent, origen) {
    const modal = await this.modalController.create({
      component: CropImagePage,
      componentProps: {imageChangedEvent}
    });
    modal.onWillDismiss().then(async (resp) => {
      if (resp.data) {
        try {
          this.base64 = resp.data.split('data:image/png;base64,')[1];
          if (origen === 'edit') {
            const fotoVieja = this.productos[this.iSel].foto || '';
            this.productos[this.iSel].foto = resp.data;
            await this.productoService.saveFotoProducto(this.productos[this.iSel], this.base64);
            if (fotoVieja) {
              this.productoService.borraFoto(this.productos[this.iSel].foto);
            }
          } else {
            this.foto = resp.data;
            this.presentAlertPrompt();
          }
        } catch (error) {
          this.presentAlert('Error', error);
        }
      }
    });
    return await modal.present();
  }

  editar(producto, i) {
    this.iSel = i;
    this.presentAlertPrompt(producto);
  }

  async guardar() {
    try {
      if (this.base64) {
        const fotoVieja = this.productos[this.iSel].foto || '';
        await this.productoService.saveFotoProducto(this.productos[this.iSel], this.base64);
        if (fotoVieja) {
          this.productoService.borraFoto(this.productos[this.iSel].foto);
        }
        this.base64 = '';
      } else {
        await this.productoService.saveProducto(this.productos[this.iSel]);
      }
    } catch (error) {
      this.presentAlert('Error', error);
    }
  }

  async presentAlertPrompt(producto?: Producto) {
    const alert = await this.alertController.create({
      header: producto ? producto.nombre : 'Nuevo producto',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          value: producto ? producto.nombre : '',
          placeholder: 'Nombre'
        },
        {
          name: 'precio',
          type: 'number',
          value: producto ? producto.precio : null,
          placeholder: 'Precio'
        },
        {
          name: 'unidad',
          type: 'text',
          value: producto ? producto.unidad : '',
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
            if (producto) {
              this.productos[this.iSel].unidad = value.unidad;
              this.productos[this.iSel].nombre = value.nombre;
              this.productos[this.iSel].precio = value.precio;
              this.guardar();
            } else {
              const prod: Producto = {
                unidad: value.unidad,
                nombre: value.nombre,
                precio: value.precio,
                foto: this.foto,
                id: '',
              };
              this.productos.push(prod);
              this.iSel = this.productos.length - 1;
              this.guardar();
            }
            console.log(this.productos);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert(title, msg) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}
