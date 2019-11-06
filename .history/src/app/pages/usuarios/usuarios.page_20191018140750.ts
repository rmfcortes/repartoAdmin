import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ModalController, ToastController } from '@ionic/angular';

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
    private usuarioService: UsuariosService,
  ) { }

  ngOnInit() {
    this.getColaboradores();
  }

  async getColaboradores() {
    this.colaboradores = await this.usuarioService.getCola();
    console.log(this.colaboradores);
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
    modal.onWillDismiss().then(resp => {
      if (resp.data) {
        this.colaboradores[this.iSel].url = resp.data;
        const base64 = resp.data.split('data:image/png;base64,')[1];
        this.usuarioService.guardaFotoUsuario(this.colaboradores[this.iSel], base64);
      }
    });
    return await modal.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
