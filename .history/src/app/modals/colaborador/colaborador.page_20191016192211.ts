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
    console.log(event);
    const valor = event.split('$');
    this.colaborador.sueldo = valor[1];
  }

  guardar() {
    this.modalCtrl.dismiss();
  }

}
