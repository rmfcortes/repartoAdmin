import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ModalController } from '@ionic/angular';
import { CropImagePage } from 'src/app/modals/crop-image/crop-image.page';
import { ColaboradorPage } from 'src/app/modals/colaborador/colaborador.page';

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
    private usuarioService: UsuariosService,
    private modalController: ModalController,
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
        alta: new Date().toDateString(),
        correo: '',
        horario: '',
        id: '',
        nacimiento: '',
        notificationId: '',
        password: '',
        permisos: false,
        puesto: '',
        status: '',
        sueldo: null,
        url: ''
      };
    } else {
      colaborador = colab;
    }
    const modal = await this.modalController.create({
      component: ColaboradorPage,
      componentProps: {colaborador}
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
      this.colaboradores[this.iSel].url = resp.data;
      const base64 = resp.data.split('data:image/png;base64,')[1];
      this.usuarioService.guardaFotoUsuario(this.colaboradores[this.iSel].id, base64);
    });
    return await modal.present();
  }

}
