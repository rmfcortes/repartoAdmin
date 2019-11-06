import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { ModalController } from '@ionic/angular';
import { CropImagePage } from '../crop-image/crop-image.page';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-colaborador',
  templateUrl: './colaborador.page.html',
  styleUrls: ['./colaborador.page.scss'],
})
export class ColaboradorPage implements OnInit {

  @Input() colaborador: Usuario;

  avatar = '../../../assets/img/camera.jpg';
  guardando = false;

  base64: string;
  fotoChange = false;

  puestos = [];

  customPickerOptions = {
    buttons: [{
      text: 'Aceptar',
      handler: (value) => this.colaborador.nacimiento = value
    }, {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
      }
    }]
  };

  meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  constructor(
    private modalCtrl: ModalController,
    private usuarioService: UsuariosService
  ) { }

  ngOnInit() {
    this.getPuestos();
  }

  async getPuestos() {
    const resp: any = await this.usuarioService.getPuestos();
    this.puestos = resp;
  }

  sueldoChange(event) {
    const sinSigno = event.replace('$', '');
    const sinComa = sinSigno.replace(/,/g, '');
    this.colaborador.sueldo = parseInt(sinComa, 10);
  }

  puestoChange(puesto) {
    this.colaborador.puesto = puesto;
  }

  async cropImage(imageChangedEvent) {
    const modal = await this.modalCtrl.create({
      component: CropImagePage,
      componentProps: {imageChangedEvent}
    });
    modal.onWillDismiss().then(resp => {
      this.fotoChange = true;
      this.colaborador.url = resp.data;
      this.base64 = resp.data.split('data:image/png;base64,')[1];
    });
    return await modal.present();
  }

  guardar() {
    console.log(this.colaborador);
    // this.modalCtrl.dismiss();
  }

  salir() {
    this.modalCtrl.dismiss();
  }

}
