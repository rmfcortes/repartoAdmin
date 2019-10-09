import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RepartidoresService } from 'src/app/services/repartidores.service';
import { Repartidores } from 'src/app/interfaces/repartidores.interface';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  ubicacion =  {
    lat: 20.622894,
    lng: -103.415830
  };

  icon = '../../../assets/img/truck.svg';

  ubicacionSub: Subscription;
  ubicacionReady = false;

  repartidores: Repartidores[];

  constructor(
    private repartidoreService: RepartidoresService,
  ) { }

  ngOnInit() {
    this.getUbicacion();
    this.listenUbiaciones();
  }

  async getUbicacion() {
    if (this.ubicacionSub) {
      return;
    }
    const resp: any = await this.repartidoreService.getUbicaciones();
    if (resp) {
      this.repartidores = resp;
    }
  }

  listenUbiaciones() {

  }

  pinSelected(pin) {
    console.log(pin);
  }

}
