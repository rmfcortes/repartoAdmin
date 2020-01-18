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
    console.log(this.colaborador);
  }

  sueldoChange(event) {
    const sinSigno = event.replace('$', '');
    const sinComa = sinSigno.replace(',', '');
    this.colaborador.sueldo = parseInt(sinComa, 10);
    console.log(sinSigno);
    console.log(sinComa);
    console.log(this.colaborador.sueldo);
  }

  guardar() {
    this.modalCtrl.dismiss();
  }

}