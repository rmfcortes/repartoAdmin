import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ModalController, ToastController, AlertController } from '@ionic/angular';

import { CropImagePage } from 'src/app/modals/crop-image/crop-image.page';
import { ColaboradorPage } from 'src/app/modals/colaborador/colaborador.page';

import { UsuariosService } from 'src/app/services/usuarios.service';

import { Usuario } from 'src/app/interfaces/usuarios.interface';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  colaboradores: Usuario[] = [];

  subiendoFoto = false;
  iSel = null;

  constructor(
    private toastController: ToastController,
    private modalController: ModalController,
    private alertController: AlertController,
    private usuarioService: UsuariosService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getColaboradores();
  }

  async getColaboradores() {
    this.colaboradores = await this.usuarioService.getCola();
  }

  async editar(colab: Usuario) {
    let colaborador: Usuario;
    if (!colab) {
      colaborador = {
        nombre: '',
        alta: '',
        correo: '',
        horario: '',
        id: '',
        nacimiento: '',
        notificationId: '',
        password: '',
        permisos: false,
        puesto: '',
        status: 'Inactivo',
        sueldo: null,
        telefono: null,
        url: ''
      };
    } else {
      colaborador = colab;
    }
    const modal = await this.modalController.create({
      component: ColaboradorPage,
      componentProps: {colaborador}
    });
    modal.onWillDismiss().then(resp => {
      if (resp && resp.data) {
        this.colaboradores.push(resp.data);
        this.presentToast('Nuevo colaborador registrado');
      }
    });
    return await modal.present();
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
    modal.onWillDismiss().then(async (resp) => {
      if (resp.data) {
        try {
          const fotoVieja = this.colaboradores[this.iSel].url || '';
          this.colaboradores[this.iSel].url = resp.data;
          const base64 = resp.data.split('data:image/png;base64,')[1];
          await this.usuarioService.guardaFotoUsuario(this.colaboradores[this.iSel], base64);
          if (fotoVieja) {
            this.usuarioService.borraFoto(fotoVieja);
          }
        } catch (error) {
          this.presentAlert('Error', error);
        }
      }
    });
    return await modal.present();
  }

  async eliminarColaborador(colaborador: Usuario, i: number) {
    try {
      await this.usuarioService.borrarColaborador(colaborador);
      this.colaboradores.splice(i, 1);
    } catch (error) {
      this.presentAlert('Error', error);
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(title, msg) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertConfirm(colaborador: Usuario, i) {
    const alert = await this.alertController.create({
      header: 'Eliminar colaborador',
      message: '¿Deseas eliminar esta persona de tu equipo de trabajo de forma permanente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.eliminarColaborador(colaborador, i);
          }
        }
      ]
    });

    await alert.present();
  }

}
