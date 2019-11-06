import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
})
export class ComentariosPage implements OnInit {

  @Input() colaborador;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.getComentarios();
  }

  getComentarios() {

  }

}
