import { Component, OnInit, NgZone } from '@angular/core';
import { ActionSheetController, Platform } from '@ionic/angular';
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
  iconSel = '../../../assets/img/truck_sel.svg';

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
  iSel: number;

  actionButtons = [];
  isVentas: boolean;
  isRuta: boolean;
  viaje: number;
  fecha: string;

  cargando: boolean;

  ventas = [];
  detallesViajes = [];

  openedWindow: number;
  cliente: string;

  latlng = [];

  constructor(
    private ngZone: NgZone,
    private platform: Platform,
    public actionSheetController: ActionSheetController,
    private repartidoreService: RepartidoresService,
  ) { }

  ngOnInit() {
    this.getUbicacion();
    this.listenUbiaciones();
  }

    // Inicio obtiene y observa ubicaciones
  async getUbicacion() {
    if (this.ubicacionSub) {
      return;
    }
    this.repartidores = await this.repartidoreService.getUbicaciones();
    this.repartidores = this.repartidores.filter(r => r.ubicacion);
    this.repartidores.sort((a, b) => b.sumario.venta - a.sumario.venta);
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

  // Acciones
  ubicarRepartidor(repa, i) {
    if (this.platform.width() < 768 ) {
      this.pagina = 'mapa';
    }
    this.verRepartidor(repa, i);
  }

  verRepartidor(repa: Repartidores, i) {
    if (this.iSel || this.iSel === 0) {
      this.repartidores[this.iSel].icon = this.icon;
    }
    this.iSel = i;
    this.repartidores[i].icon = this.iconSel;
    this.repartidor = repa.datos;
    this.ubicacion = repa.ubicacion;
    this.repartidor.foto = this.repartidor.foto || '../../../assets/img/chofer.png';
    this.verChofer = true;
  }

  deSelect() {
    this.repartidores[this.iSel].icon = this.icon;
    this.verChofer = false;
    this.iSel = null;
  }

  verVentas() {
    this.isVentas = true;
    this.getBotones();
  }

  async getVentas() {
    const ventas = await this.repartidoreService.getVentas(this.repartidor.id, this.viaje, this.fecha);
    if (ventas) {
      this.ventas = Object.values(ventas);
    }
    const detalles: any = await this.repartidoreService.getDetallesVenta(this.repartidor.id, this.viaje, this.fecha);
    if (this.viaje) {
      this.detallesViajes.push(detalles);
    } else {
      this.detallesViajes = detalles;
    }
    this.cargando = false;
  }

  async verInfoCliente(i) {
    this.openedWindow = i;
  }

  verRuta() {
    this.isRuta = true;
    this.getBotones();
    console.log('ruta');
  }

  getRuta() {
    const ruta = this.repartidoreService.getRuta(this.repartidor.id, this.viaje, this.fecha);
    console.log(ruta);
    console.log('ruta');
  }

  verViajes() {

  }

  verGastos() {

  }

  // Auxiliares

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona el viaje',
      buttons: this.actionButtons
    });
    await actionSheet.present();
  }

  getBotones() {
    this.actionButtons = [];
    for (let index = 1; index < this.repartidores[this.iSel].sumario.viajes + 1; index++) {
      this.actionButtons.push({
        text: index,
        handler: async () => {
          this.viaje = index;
          this.cargando = true;
          this.compara();
        }
      });
    }
    this.agregaTodos();
    this.presentActionSheet();
  }

  agregaTodos() {
    this.actionButtons.push({
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        // this.viaje = null;
        // this.isVentas = false;
        // this.isRuta = false;
        // this.cargando = false;
      }
    });
    this.actionButtons.unshift({
      text: 'Todos',
      handler: () => {
        this.viaje = null;
        this.cargando = true;
        this.compara();
      }
    });
  }

  compara() {
    if (this.isVentas) {
      this.getVentas();
    } else if (this.isRuta) {
      this.getRuta();
    }
  }

  limpiaVentas() {
    this.ventas = [];
    this.detallesViajes = [];
  }

  isInfoWindowOpen(i) {
    return this.openedWindow === i;
  }

}
