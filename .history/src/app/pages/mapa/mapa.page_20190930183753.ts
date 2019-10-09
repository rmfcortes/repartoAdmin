import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RepartidoresService } from 'src/app/services/repartidores.service';
import { Repartidores } from 'src/app/interfaces/repartidores.interface';
import { snapshotChanges } from '@angular/fire/database';

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
    this.repartidores = await this.repartidoreService.getUbicaciones();
  }

  listenUbiaciones() {
    this.repartidoreService.sigue().query.ref.on('child_changed', snapshotChanges => {
      const new = snapshotChanges.val();
      
    });
  }

  pinSelected(pin) {
    console.log(pin);
  }

}
