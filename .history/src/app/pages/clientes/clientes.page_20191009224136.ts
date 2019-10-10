import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes.service';
import { Cliente } from 'src/app/interfaces/clientes.interface';
import { Producto } from 'src/app/interfaces/productos.interface';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

  clientes: Cliente[];
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

  constructor(
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private clienteService: ClientesService,
  ) { }

  ngOnInit() {
    this.getClientes();
  }

  async getClientes() {
    const hoy = new Date();
    this.clientes = await this.clienteService.getClientes();
    this.clientes = this.clientes.filter(c => c.direccion);
    this.clientes = this.clientes.filter(c => c.ultimaCompra);
    for (const c of this.clientes) {
        c.dias = await this.diasTranscurridos(c.ultimaCompra, hoy);
    }
    this.clientes.sort((a, b) => b.acumulado - a.acumulado);
    this.clientesReady = true;
    console.log(this.clientes);
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
      precios[p.id] = p.precio;
    });
    await this.clienteService.guardaPrecio(this.cliente.cliente, precios);
    this.presentToast(`Precios de ${this.cliente.nombre} actulizados`);
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
          this.clientes.sort((a, b) => b.acumulado - a.acumulado);
          }
        },
        {
        text: 'Por menor volumen de compra',
        handler: () => {
          this.clientes.sort((a, b) => a.acumulado - b.acumulado);
          }
        },
        {
          text: 'Compra más reciente',
          handler: () => {
          this.clientes.sort((a, b) => b.ultimaCompra - a.ultimaCompra);
          }
        },
        {
          text: 'Compra más antigua',
          handler: () => {
          this.clientes.sort((a, b) => a.ultimaCompra - b.ultimaCompra);
          }
        },
      ]
    });
    await actionSheet.present();
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500
    });
    toast.present();
  }

}
