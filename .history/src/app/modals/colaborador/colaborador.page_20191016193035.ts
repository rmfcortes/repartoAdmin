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
    const sinSigno = event.split('$');
    console.log(sinSigno);
    if (sinSigno[1]) {
      const valor = sinSigno[1].split(',');
      console.log(valor);
      if (valor[1]) {
        this.colaborador.sueldo = parseInt(valor[1], 10);
      } else {
        this.colaborador.sueldo = parseInt(valor[0], 10);
      }
    }
    console.log(this.colaborador.sueldo);
  }

  guardar() {
    this.modalCtrl.dismiss();
  }

}
