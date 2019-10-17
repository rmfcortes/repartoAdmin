import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ModalController } from '@ionic/angular';
import { CropImagePage } from 'src/app/modals/crop-image/crop-image.page';

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
