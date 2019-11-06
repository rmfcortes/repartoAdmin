import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, ActionSheetController, IonInfiniteScroll } from '@ionic/angular';
import { ResumenRate, Comentario } from 'src/app/interfaces/rate.interface';
import { RateService } from 'src/app/services/rate.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
})
export class ComentariosPage implements OnInit {

  @Input() colaborador: ResumenRate;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  comentarios: Comentario[] = [];

  noMore = false;
  batch = 7;
  lastKey = '';

  comentariosReady = false;

  get = 'todos';

  lastValue = null;
  lastfecha = null;

  constructor(
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private rateService: RateService,
  ) { }

  ngOnInit() {
    this.getComentarios();
  }

  async getComentarios(event?) {
    let comentarios: Comentario[];
    switch (this.get) {
      case 'todos':
        comentarios = await this.rateService.getComentarios(this.colaborador.id, this.batch + 1, this.lastKey);
        break;
      case 'mayores':
        comentarios = await this.rateService.getComentariosAltos(this.colaborador.id, this.batch + 1, this.lastKey, this.lastValue);
        break;
      case 'menores':
        comentarios = await this.rateService.getComentariosMenores(this.colaborador.id, this.batch + 1, this.lastKey, this.lastValue);
        break;
      case 'recientes':
        comentarios = await this.rateService.getComentariosRecientes(this.colaborador.id, this.batch + 1, this.lastKey, this.lastfecha);
        break;
      case 'viejos':
        comentarios = await this.rateService.getComentariosAntiguos(this.colaborador.id, this.batch + 1, this.lastKey, this.lastfecha);
        break;
    }
    this.lastKey = comentarios[0].id || null;
    this.lastfecha = comentarios[0].fecha || null;
    this.lastValue = comentarios[0].calificacion.puntos;
    if (comentarios.length === this.batch + 1) {
      comentarios.shift();
    } else {
      this.noMore = true;
    }
    this.comentarios = this.comentarios.concat(comentarios.reverse());
    if (event) { event.target.complete(); }
    this.comentariosReady = true;
  }

  loadComentarios(event) {
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    this.getComentarios(event);

    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  async presentOrdenar() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ordenar por:',
      buttons: [{
        text: 'Mejor puntuados',
        handler: () => {
          this.get = 'mayores';
          this.resetComentarios();
        }
      }, {
        text: 'Peor puntuados',
        handler: () => {
          this.get = 'menores';
          this.resetComentarios();
        }
      }, {
        text: 'Recientes',
        handler: () => {
          this.get = 'recientes';
          this.resetComentarios();
        }
      }, {
        text: 'Más antiguos',
        handler: () => {
          this.get = 'viejos';
          this.resetComentarios();
        }
      }, {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  resetComentarios() {
    this.comentarios = [];
    this.infiniteScroll.disabled = false;
    this.noMore = false;
    this.lastKey = '';
    this.getComentarios();
  }

  salir() {
    this.modalCtrl.dismiss();
  }

}
