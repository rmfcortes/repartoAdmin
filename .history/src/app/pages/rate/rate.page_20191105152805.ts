import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { RateService } from 'src/app/services/rate.service';
import { Usuario } from 'src/app/interfaces/usuarios.interface';

import { ResumenRate } from 'src/app/interfaces/rate.interface';
import { ComentariosPage } from 'src/app/modals/comentarios/comentarios.page';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.page.html',
  styleUrls: ['./rate.page.scss'],
})
export class RatePage implements OnInit {

  rates: ResumenRate[] = [];
  colaboradores: Usuario[] = [];
  rateReady = false;

  avatar = '../../../assets/img/chofer.png';

  constructor(
    private rateService: RateService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUsuarios();
  }

  async getUsuarios() {
    this.colaboradores = await this.rateService.getColaboradores();
    this.getRates();
  }

  async getRates() {
    this.rates = await this.rateService.getRates();
    this.rates.forEach(r => {
      const i = this.colaboradores.findIndex(c => c.id === r.id);
      if (i >= 0) {
        r.nombre = this.colaboradores[i].nombre;
        r.foto = this.colaboradores[i].url || this.avatar;
      }
    });
    this.rateReady = true;
  }

  async verComentarios(colaborador) {
    const modal = await this.modalController.create({
      component: ComentariosPage,
      componentProps: {colaborador}
    });

    return await modal.present();
  }

}
