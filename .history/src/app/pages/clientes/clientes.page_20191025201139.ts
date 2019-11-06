import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ToastController, ModalController } from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes.service';
import { Cliente } from 'src/app/interfaces/clientes.interface';
import { Producto } from 'src/app/interfaces/productos.interface';
import { SearchPage } from 'src/app/modals/search/search.page';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

  clientes: Cliente[] = [];
  clientesReady = false;

  pin = '../../../assets/img/casa.svg';

  ubicacion = {
    lat: 20.622894,
    lng: -103.415830
  };

  pagina = 'lista';
  cliente: Cliente;

  iSel = 0;
  precios = [];
  cargando = false;

  productos: Producto[] = [];

  noMore = false;
  batch = 10;
  lastKey = '';

  hoy = new Date();
  isFirst = true;

  infiniteCall = 1;

  get = 'todos';

  constructor(
    private toastController: ToastController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private clienteService: ClientesService,
  ) { }

  ngOnInit() {
    this.getClientes();
  }

  async getClientes(event?) {
    if (this.noMore) {
      this.clientesReady = true;
      if (event) { event.target.complete(); }
      return;
    }
    let clientes: Cliente[];
    console.log(this.get);
    switch (this.get) {
      case 'todos':
        clientes = await this.clienteService.getClientes(this.batch + 1, this.lastKey);
        break;
      case 'mayorVolumenCompra':
        clientes = await this.clienteService.getClientesMayorCompra(this.batch + 1, this.lastKey);
        break;
      case 'compraReciente':
        clientes = await this.clienteService.getClientesCompraReciente(this.batch + 1, this.lastKey);
        break;
    }
    if (this.lastKey && this.lastKey === clientes[0].cliente) {
      this.noMore = true;
      this.clientesReady = true;
      if (event) { event.target.complete(); }
      return;
    }
    this.lastKey = clientes[0].cliente || null;
    if (clientes.length === this.batch + 1) { clientes.shift(); }
    if (clientes && clientes.length > 0) {
      clientes = await this.filtraClientes(clientes);
      if (clientes.length > 0) {
        this.evaluaClientes(clientes, event);
      } else {
        this.getClientes();
        return;
      }
    } else {
      this.noMore = true;
    }
  }

  filtraClientes(clientes: Cliente[]): Promise<Cliente[]> {
    return new Promise((resolve, reject) => {
      clientes = clientes.filter(c => c.direccion);
      clientes = clientes.filter(c => c.ultimaCompra);
      resolve(clientes);
    });
  }

  async evaluaClientes(clientes: Cliente[], event?) {
    clientes = await this.getLapsoUltimaCompra(clientes);
    this.clientes = this.clientes.concat(clientes.reverse());
    if (clientes.length === this.batch + 1 || this.clientes.length >= this.batch * this.infiniteCall) {
      this.clientesReady = true;
    } else {
      this.getClientes();
    }
    if (event) { event.target.complete(); }
    if (this.isFirst) {
      this.ubicarCliente(this.clientes[0], 0);
      this.isFirst = false;
    }
  }

  getLapsoUltimaCompra(clientes: Cliente[]): Promise<Cliente[]> {
    return new Promise(async (resolve, reject) => {
      for (const c of clientes) {
        c.dias = await this.diasTranscurridos(c.ultimaCompra, this.hoy);
      }
      resolve(clientes);
    });
  }

  loadClientes(event) {
    this.infiniteCall++;
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    this.getClientes(event);

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  // Acciones

  ubicarCliente(cliente, i) {
    this.iSel = i;
    this.precios = [];
    this.cliente = cliente;
    this.verPrecios();
  }

  async verPrecios() {
    this.cargando = true;
    if (this.productos.length === 0) {
      this.productos = await this.clienteService.getProductos();
    }
    this.precios = JSON.parse(JSON.stringify(this.productos));
    if (!this.cliente.precio) {
      this.cargando = false;
      return;
    }
    const preciosEspeciales = Object.entries(this.cliente.precio);
    this.precios.forEach((p: any) => {
      const i = preciosEspeciales.findIndex(pe => pe[0] === p.id);
      if (i >= 0) {
       p.precio = preciosEspeciales[i][1];
      }
    });
    this.cargando = false;
  }

  async guardaPrecio() {
    const precios = {};
    this.precios.forEach(p => {
      precios[p.id] = parseInt(p.precio, 10);
    });
    await this.clienteService.guardaPrecio(this.cliente.cliente, precios);
    this.presentToast(`Precios de ${this.cliente.nombre} actulizados`);
  }

  precioChange(event, i) {
    const sinSigno = event.replace('$', '');
    const sinComa = sinSigno.replace(/,/g, '');
    this.precios[i].precio = parseInt(sinComa, 10);
  }

  async buscar() {
    const modal = await this.modalController.create({
      component: SearchPage,
    });
    modal.onWillDismiss().then(resp => {
      if (resp.data) {
        this.clientes.unshift(resp.data);
        this.ubicarCliente(resp.data, 0);
      }
    });
    return await modal.present();
  }

  // Auxiliares

  diasTranscurridos(lastBuy, hoy: Date) {
    const dif = hoy.getTime() - lastBuy;
    const difInDays = dif / ( 1000 * 60 * 60 * 24);
    return difInDays;
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ordenar',
      buttons: [
        {
        text: 'Por mayor volumen de compra',
        handler: () => {
            this.get = 'mayorVolumenCompra';
            this.irAclientes();
          }
        },
        {
        text: 'Por menor volumen de compra',
        handler: () => {
            this.get = 'menorVolumenCompra';
            this.irAclientes();
          }
        },
        {
          text: 'Compra más reciente',
          handler: () => {
            this.get = 'compraReciente';
            this.irAclientes();
          }
        },
        {
          text: 'Compra más antigua',
          handler: () => {
            this.get = 'compraVieja';
            this.irAclientes();
          }
        },
      ]
    });
    await actionSheet.present();
  }

  irAclientes() {
    this.noMore = false;
    this.clientes = [];
    this.getClientes();
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500
    });
    toast.present();
  }

}
