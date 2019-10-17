import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-colaborador',
  templateUrl: './colaborador.page.html',
  styleUrls: ['./colaborador.page.scss'],
})
export class ColaboradorPage implements OnInit {

  @Input() colaborador: Usuario;

  avatar= '../../../assets/img/chofer.png';

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  sueldoChange(event) {
    const sinSigno = event.replace('$', '');
    const sinComa = sinSigno.replace(/,/g, '');
    this.colaborador.sueldo = parseInt(sinComa, 10);
  }

  guardar() {
    this.modalCtrl.dismiss();
  }

}
