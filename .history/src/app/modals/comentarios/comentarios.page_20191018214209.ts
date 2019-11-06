import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ResumenRate, Comentario } from 'src/app/interfaces/rate.interface';
import { RateService } from 'src/app/services/rate.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
})
export class ComentariosPage implements OnInit {

  @Input() colaborador: ResumenRate;

  comentarios: Comentario[] = [];

  constructor(
    private modalCtrl: ModalController,
    private rateService: RateService,
  ) { }

  ngOnInit() {
    this.getComentarios();
  }

  async getComentarios() {
    this.comentarios = await this.rateService.getComentarios(this.colaborador.id);
    console.log(this.comentarios);
  }

  salir() {
    this.modalCtrl.dismiss();
  }

}
