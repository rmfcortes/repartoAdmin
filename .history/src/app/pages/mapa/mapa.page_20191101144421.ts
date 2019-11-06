import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActionSheetController, Platform, ToastController, ModalController } from '@ionic/angular';
import {
  CalendarModal,
  CalendarModalOptions,
  CalendarResult
} from 'ion2-calendar';
import { Subscription } from 'rxjs';

import { PedidosService } from 'src/app/services/pedidos.service';
import { RepartidoresService } from 'src/app/services/repartidores.service';

import { Repartidores, DatosRepartidor } from 'src/app/interfaces/repartidores.interface';
import { Pedido } from 'src/app/interfaces/pedidos.interface';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, OnDestroy {

  ubicacion =  {
    lat: 20.622894,
    lng: -103.415830
  };

  icon = '../../../assets/img/truck.svg';
  iconSel = '../../../assets/img/truck_sel.svg';
  casa = '../../../assets/img/casa.svg';

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
  getBtn = 'venta';
  viaje: number;
  fecha: string;

  cargando: boolean;

  ventas = [];
  detallesViajes = [];

  compras = [];

  openedWindow: number;
  cliente: string;

  latlng = [];

  txtSearch = '';

  cargandoRepas = false;
  hoy: string;

  abriendoCalendario = false;
  recorrido = 0;

  horas = 0;
  minutos = 0;

  verDetCom = true;
  verDetVen = true;
  verDetRut = true;
  verDetPed = true;

  pedSub: Subscription;
  loadPedidos = false;
  pedidos = {
    asignados: 0,
    pendientes: 0
  };
  detallesPedidos: Pedido[] = [];

  vendedoresButtons = [];

  constructor(
    private ngZone: NgZone,
    private platform: Platform,
    private datePipe: DatePipe,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    public actionSheetController: ActionSheetController,
    private repartidoreService: RepartidoresService,
    private pedidoService: PedidosService,
  ) {
    const date = new Date();
    this.fecha = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.hoy = this.datePipe.transform(date, 'yyyy-MM-dd');
   }

  ngOnInit() {
    this.getRepartidores();
    this.listenChanges();
    this.listenPedidos();
  }

    // Inicio obtiene y observa ubicaciones
  async getRepartidores() {
    this.cargandoRepas = true;
    this.repartidores = await this.repartidoreService.getRepartidores();
    this.repartidores.sort((a, b) => b.sumario.venta - a.sumario.venta);
    this.repartidores.forEach(r => {
      if (!r.ubicacion) {
        r.ubicacion = {
          lat: this.ubicacion.lat,
          lng: this.ubicacion.lng
        };
      }
    });
    this.repaReady = true;
    this.cargandoRepas = false;
    console.log(this.repartidores);
  }

  listenChanges() {
    this.repartidoreService.sigue().query.ref.on('child_changed', snapshot => {
      const data = snapshot.val();
      const i = this.repartidores.findIndex(r => r.datos.id === data.datos.id);
      this.ngZone.run(() => {
        this.repartidores[i].ubicacion = data.ubicacion;
        if (this.fecha === this.hoy) {
          this.repartidores[i].sumario = data.sumario;
        }
      });
    });
  }

  listenPedidos() {
    this.pedSub = this.pedidoService.listenPedidos().subscribe((pedidos: any) => {
      this.pedidos.asignados = pedidos.asignados;
      this.pedidos.pendientes = pedidos.pendientes;
      console.log(this.pedidos);
    });
  }

  eliminarPedido(pedido, i) {

  }

  asignarPedido(pedido, idVendedor) {
    this.pedidoService.asignarPedido(pedido, idVendedor);
  }

  reasignar(pedido, vendedor) {
    this.pedidoService.asignarPedido(pedido, vendedor);
  }

  // Acciones

  verPedidos() {
    this.loadPedidos = true;
    this.listenPendientes();
    this.listenAsignados();
  }

  listenPendientes() {
    this.pedidoService.getPedidosPendientes().query.ref.on('child_added', snapshot => {
      this.ngZone.run(() => {
        const pedido = snapshot.val();
        this.detallesPedidos.unshift(pedido);
        this.loadPedidos = false;
        console.log(this.detallesPedidos);
      });
    });
  }

  listenAsignados() {
    this.pedidoService.getPedidosAsignados().query.ref.on('child_added', snapshot => {
      this.ngZone.run(() => {
        const pedido = snapshot.val();
        console.log(pedido);
        if (this.detallesPedidos.length === 0) {
          this.detallesPedidos.unshift(pedido);
        } else {
          const i = this.detallesPedidos.findIndex(p => p.pedido.id === pedido.pedido.id);
          if (i >= 0) {
            this.detallesPedidos[i].chofer = pedido.chofer.nombre;
          } else {
            this.detallesPedidos.unshift(pedido);
          }
        }
        this.loadPedidos = false;
      });
    });
  }

  verInfoPedido(i) {
    this.openedWindow = i;
  }

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
    this.getBtn = 'ventas';
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
    console.log(this.detallesViajes);
  }

  async verInfoCliente(i) {
    this.openedWindow = i;
  }

  verRuta() {
    this.getBtn = 'ruta';
    this.getBotones();
  }

  async getRuta() {
    try {
      const ruta = await this.repartidoreService.getRuta(this.repartidor.id, this.viaje, this.fecha);
      if (ruta) {
        this.latlng = Object.values(ruta);
        this.recorrido = 0;
        for (let index = 0; index < this.latlng.length - 1; index++) {
          const distancia = await this.calculaDistancia(
            this.latlng[index].lat,
            this.latlng[index].lng,
            this.latlng[index + 1].lat,
            this.latlng[index + 1].lng);
          this.recorrido += distancia;
        }
        const momento = ( this.latlng[this.latlng.length - 1].stamp - this.latlng[0].stamp) / 60000;
        const horas = momento / 60;
        this.horas = horas < 1 ? 0 : Math.floor(horas);
        const minutos = (horas - this.horas) * 60;
        this.minutos = Math.floor(minutos);
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
    this.getBtn = 'compras';
    this.getBotones();
  }

  async getCompras() {
    try {
      const compras: any = await this.repartidoreService.getCompras(this.repartidor.id, this.viaje, this.fecha);
      if (compras) {
        this.compras = compras;
      } else {
        this.presentToast('No hay registros de compras');
      }
      this.cargando = false;
    } catch (error) {
      this.cargando = false;
      this.presentToast('Error' + error);
    }
    console.log(this.compras);
  }

  busca() {
    this.repartidores.forEach(c => {
        if (c.datos.nombre.toLowerCase().includes(this.txtSearch.toLowerCase()) && !c.filtrado) {
            c.display = 'block';
          } else {
            c.display = 'none';
          }
    });
  }

  async openCalendar() {
    this.abriendoCalendario = true;
    const primer: string = await this.repartidoreService.getPrimerRegistro();
    const parts: any = primer.split('-');
    const primerFecha = new Date(parts[0], parts[1] - 1, parts[2]);
    const options: CalendarModalOptions = {
      title: '',
      from: primerFecha,
      to: new Date(),
      defaultDate: new Date(),
      defaultScrollTo: new Date(),
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
    if (date) {
      this.fecha = date.string;
      this.getBalance(date.string);
    }
    this.abriendoCalendario = false;
  }

  async getBalance(dia) {
    this.cargandoRepas = true;
    this.limpiaRuta();
    this.limpiaVentas();
    this.limpiaCompras();
    if (this.hoy === this.fecha) {
      this.getRepartidores();
      return;
    }
    const balance = await this.repartidoreService.getBalance(dia);
    this.repartidores.forEach(repartidor => {
      const index = balance.findIndex(r => r.id === repartidor.datos.id);
      if (index >= 0) {
        repartidor.sumario.balance = balance[index].balance;
        repartidor.sumario.entrega = balance[index].entrega;
        repartidor.sumario.diferencia = balance[index].diferencia;
        repartidor.sumario.valida = balance[index].valida;
        repartidor.sumario.venta = balance[index].venta;
        repartidor.sumario.gasto = balance[index].gasto;
        repartidor.sumario.viajes = balance[index].viajes;
        repartidor.filtrado = false;
        repartidor.display = 'block';
      } else {
        repartidor.display = 'none';
        repartidor.filtrado = true;
      }
    });
    this.cargandoRepas = false;
  }

  // Auxiliares

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona el viaje',
      buttons: this.actionButtons
    });
    await actionSheet.present();
  }

  async presentVendedoresSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona el repartidor',
      buttons: this.vendedoresButtons
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
    if (this.actionButtons.length > 0) {
      this.agregaTodos();
      this.presentActionSheet();
    } else {
      this.presentToast('Aún no hay registros');
    }
  }

  getVendedoresBtn(pedido) {
    this.vendedoresButtons = [];
    this.repartidores.forEach(r => {
      this.vendedoresButtons.push({
        text: r.datos.nombre,
        handler: async () => {
          this.asignarPedido(pedido, r.datos.id);
        }
      });
    });
    this.vendedoresButtons.push({
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
      }
    });
    this.presentVendedoresSheet();
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
    switch (this.getBtn) {
      case 'ventas':
        this.getVentas();
        break;
      case 'ruta':
        this.getRuta();
        break;
      case 'compras':
        this.getCompras();
        break;
    }
  }

  limpiaPedidos() {
    this.detallesPedidos = [];
  }

  limpiaVentas() {
    this.ventas = [];
    this.detallesViajes = [];
  }

  limpiaRuta() {
    this.latlng = [];
  }

  limpiaCompras() {
    this.compras = [];
  }

  isInfoWindowOpen(i) {
    if (this.openedWindow === i) {
      return true;
    } else {
      return false;
    }
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500
    });
    toast.present();
  }

  calculaDistancia( lat1, lng1, lat2, lng2 ): Promise<number> {
    return new Promise ((resolve, reject) => {
      const R = 6371; // Radius of the earth in km
      const dLat = this.deg2rad(lat2 - lat1);  // this.deg2rad below
      const dLon = this.deg2rad(lng2 - lng1);
      const a =
         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
         Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
         Math.sin(dLon / 2) * Math.sin(dLon / 2)
         ;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // Distance in km
      resolve(d);
    });
  }

  deg2rad( deg ) {
    return deg * (Math.PI / 180);
  }

  ngOnDestroy() {
    this.pedSub.unsubscribe();
    this.pedidoService.getPedidosPendientes().query.ref.off('child_added');
    this.pedidoService.getPedidosAsignados().query.ref.off('child_added');
  }

}
