import { Component, OnInit, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { RepartidoresService } from 'src/app/services/repartidores.service';
import { Repartidores, DatosRepartidor } from 'src/app/interfaces/repartidores.interface';

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

  repartidores: Repartidores[];
  repaReady = false;

  verChofer = false;
  repartidor: DatosRepartidor =  {
    foto: '../../../assets/img/chofer.png',
    id: '',
    nombre: '',
    telefono: '',
    token: ''
  };

  pagina = 'lista';

  constructor(
    private ngZone: NgZone,
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
    this.repartidores = this.repartidores.filter(r => r.ubicacion);
    this.repaReady = true;
  }

  listenUbiaciones() {
    this.repartidoreService.sigue().query.ref.on('child_changed', snapshot => {
      const data = snapshot.val();
      const i = this.repartidores.findIndex(r => r.datos.id === data.datos.id);
      this.ngZone.run(() => {
        this.repartidores[i].ubicacion.lat = data.ubicacion.lat;
        this.repartidores[i].ubicacion.lng = data.ubicacion.lng;
      });
    });
  }

  llamar() {
    console.log(this.repartidor);
    window.open(`tel:${this.repartidor.telefono}`, '_system');
  }

  ubicarRepartidor() {
    this.pagina = 'mapa';
    
  }

  verRepartidor(repa: Repartidores) {
    this.repartidor = repa.datos;
    this.repartidor.foto = this.repartidor.foto || '../../../assets/img/chofer.png';
    console.log(this.repartidor);
    this.verChofer = true;
  }

  segmentChanged(event) {
    this.pagina = event.detail.value;
    if (this.pagina === 'lista') {

    }
  }

}
