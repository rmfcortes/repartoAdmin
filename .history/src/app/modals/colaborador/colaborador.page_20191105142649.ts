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
  fotoVieja: string;

  constructor(
    private ngZone: NgZone,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private usuarioService: UsuariosService
  ) { }

  ngOnInit() {
    this.getPuestos();
    this.listenErrores();
    this.fotoVieja = this.colaborador.url || '';
  }

  async getPuestos() {
    const resp: any = await this.usuarioService.getPuestos();
    this.puestos = resp;
  }

  async listenErrores() {
    this.usuarioService.getCreateUserResult().query.ref.on('child_added', snapshot => {
      this.ngZone.run(() => {
        const status = snapshot.val();
        switch (status) {
          case 'auth/email-already-exists':
            this.presentAlert('Email registrado', 'El correo que intentas registrar corresponde a una cuenta existente. Intenta con otro');
            break;
          case 'auth/invalid-email':
            this.presentAlert('Email inválido', 'El correo que intentas registrar no corresponde a un email válido');
            break;
          case 'auth/invalid-password':
            this.presentAlert('Contraseña insegura', 'La contraseña debe tener al menos 6 caracteres');
            break;
          case 'ok':
            this.usuarioService.cleanResult();
            this.usuarioService.updatePermisos(this.colaborador);
            this.modalCtrl.dismiss(this.colaborador);
            break;
          default:
            this.presentAlert('Error', 'Algo salió mal, por favor intenta de nuevo');
            break;
        }
        this.guardando = false;
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

  async guardar() {
    this.guardando = true;
    let nuevo;
    if (!this.colaborador.id) {
      nuevo = true;
    }
    try {
      if (this.base64) {
        await this.usuarioService.guardaFotoUsuario(this.colaborador, this.base64);
        this.base64 = '';
        if (this.fotoVieja) {
          this.usuarioService.borraFoto(this.fotoVieja);
        }
      } else {
        await this.usuarioService.updateUsuario(this.colaborador);
      }
      if (!nuevo) {
        this.usuarioService.updatePermisos(this.colaborador);
        this.guardando = false;
        this.salir();
      }
    } catch (error) {
      this.presentAlert('Error', 'Algo salió mal. Por favor intenta de nuevo o comunícate con soporte');
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

  async presentAlert(titulo, msg) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}
