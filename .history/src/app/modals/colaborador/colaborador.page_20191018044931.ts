import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { ModalController, AlertController } from '@ionic/angular';
import { CropImagePage } from '../crop-image/crop-image.page';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-colaborador',
  templateUrl: './colaborador.page.html',
  styleUrls: ['./colaborador.page.scss'],
})
export class ColaboradorPage implements OnInit {

  @Input() colaborador: Usuario;

  avatar = '../../../assets/img/avatar.jpg';
  guardando = false;

  base64: string;

  puestos = [];

  meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  constructor(
    private ngZone: NgZone,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private usuarioService: UsuariosService
  ) { }

  ngOnInit() {
    this.getPuestos();
    this.listenErrores();
  }

  async getPuestos() {
    const resp: any = await this.usuarioService.getPuestos();
    this.puestos = resp;
  }

  async listenErrores() {
    this.usuarioService.getErrores().query.ref.on('child_added', snapshot => {
      this.ngZone.run(() => {
        const error = snapshot.val();
        console.log(error);
      });
    });
  }

  sueldoChange(event) {
    const sinSigno = event.replace('$', '');
    const sinComa = sinSigno.replace(/,/g, '');
    this.colaborador.sueldo = parseInt(sinComa, 10);
  }

  puestoChange(puesto) {
    this.colaborador.puesto = puesto;
  }

  addPuesto(puesto) {
    this.puestos.unshift(puesto);
    this.colaborador.puesto = puesto;
    this.usuarioService.addPuesto(puesto);
  }

  async cropImage(imageChangedEvent) {
    const modal = await this.modalCtrl.create({
      component: CropImagePage,
      componentProps: {imageChangedEvent}
    });
    modal.onWillDismiss().then(resp => {
      this.colaborador.url = resp.data;
      this.base64 = resp.data.split('data:image/png;base64,')[1];
    });
    return await modal.present();
  }

  guardar() {
    if (this.base64) {
      this.usuarioService.guardaFotoUsuario(this.colaborador, this.base64);
      this.salir();
    } else {
      this.usuarioService.updateUsuario(this.colaborador);
      this.salir();
    }
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Agregar puesto',
      inputs: [
        {
          name: 'puesto',
          type: 'text',
          placeholder: 'Nuevo puesto'
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
            this.addPuesto(value.puesto);
          }
        }
      ]
    });

    await alert.present();
  }

}
