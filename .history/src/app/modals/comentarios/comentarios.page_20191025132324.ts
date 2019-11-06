import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
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

  noMore = false;
  batch = 7;
  lastKey = '';

  comentariosReady = false;

  constructor(
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private rateService: RateService,
  ) { }

  ngOnInit() {
    this.getComentarios();
  }

  async getComentarios(event?) {
    const comentarios: Comentario[] = await this.rateService
      .getComentarios(this.colaborador.id, this.batch + 1, this.lastKey);
    this.lastKey = comentarios[0].id || null;
    if (comentarios.length === this.batch + 1) {
      comentarios.shift();
    } else {
      this.noMore = true;
    }
    this.comentarios = this.comentarios.concat(comentarios.reverse());
    if (event) { event.target.complete(); }
    this.comentariosReady = true;
    console.log(this.comentarios);
  }

  loadComentarios(event) {
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    this.getComentarios(event);

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  async presentOrdenar() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ordenar por:',
      buttons: [{
        text: 'De mayor a menor puntuación',
        handler: () => {
          this.comentarios.sort((a, b) => b.calificacion.puntos - a.calificacion.puntos);
        }
      }, {
        text: 'De menor a mayor puntuación',
        handler: () => {
          this.comentarios.sort((a, b) => a.calificacion.puntos - b.calificacion.puntos);
        }
      }, {
        text: 'Recientes',
        handler: () => {
          this.comentarios.sort((a, b) => b.fecha - a.fecha);
        }
      }, {
        text: 'Más antiguos',
        handler: () => {
          this.comentarios.sort((a, b) => a.fecha - b.fecha);
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


  salir() {
    this.modalCtrl.dismiss();
  }

}
