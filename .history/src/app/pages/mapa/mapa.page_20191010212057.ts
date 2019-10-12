import { Component, OnInit, NgZone } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActionSheetController, Platform, ToastController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult
} from 'ion2-calendar';

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

  txtSearch = '';

  constructor(
    private ngZone: NgZone,
    private platform: Platform,
    private datePipe: DatePipe,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    public actionSheetController: ActionSheetController,
    private repartidoreService: RepartidoresService,
  ) {
    const date = new Date();
    this.fecha = this.datePipe.transform(date, 'yyyy-MM-dd');
   }

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
    this.latlng = [];
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
    try {
      const ventas = await this.repartidoreService.getVentas(this.repartidor.id, this.viaje, this.fecha);
      if (ventas) {
        this.ventas = Object.values(ventas);
      }
      const detalles: any = await this.repartidoreService.getDetallesVenta(this.repartidor.id, this.viaje, this.fecha);
      if (detalles) {
        if (this.viaje) {
          this.detallesViajes.push(detalles);
        } else {
          this.detallesViajes = detalles;
        }
      }
      if (!ventas || !detalles) {
        this.presentToast('No hay registros de ventas');
      }
      this.cargando = false;
    } catch (error) {
      this.cargando = false;
      this.presentToast('Error' + error);
    }
  }

  async verInfoCliente(i) {
    this.openedWindow = i;
  }

  verRuta() {
    this.isRuta = true;
    this.getBotones();
  }

  async getRuta() {
    try {
      const ruta = await this.repartidoreService.getRuta(this.repartidor.id, this.viaje, this.fecha);
      if (ruta) {
        this.latlng = Object.values(ruta);
      } else {
        this.presentToast('No hay registros de recorrido');
      }
      this.cargando = false;
    } catch (error) {
      this.cargando = false;
      this.presentToast('Error' + error);
    }
  }

  verGastos() {

  }

  busca() {
    this.repartidores.forEach(c => {
        if (c.datos.nombre.toLowerCase().includes(this.txtSearch.toLowerCase())) {
            c.display = 'block';
          } else {
            c.display = 'none';
          }
    });
  }

  async openCalendar() {
    const primer: string = await this.repartidoreService.getPrimerRegistro();
    const parts: any = primer.split('-');
    const primerFecha = new Date(parts[0], parts[1] - 1, parts[2]);
    const options: CalendarModalOptions = {
      title: '',
      from: primerFecha,
      to: new Date(),
      defaultDate: new Date(),
      weekdays: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      weekStart: 1,
      color: 'dark',
      closeLabel: 'Cancelar',
      doneLabel: 'Aceptar'
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date: CalendarResult = event.data;
    this.fecha = date.string;
    console.log(date);
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

  limpiaRuta() {
    this.latlng = [];
  }

  isInfoWindowOpen(i) {
    return this.openedWindow === i;
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500
    });
    toast.present();
  }

}
