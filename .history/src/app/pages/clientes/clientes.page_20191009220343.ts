import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
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

  iSel: number;
  precios = [];
  cargando = false;

  productos: Producto[] = [];

  constructor(
    private clienteService: ClientesService,
    private actionSheetController: ActionSheetController,
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
  }

  async verPrecios(cliente) {
    this.cargando = true;
    if (this.productos.length === 0) {
      this.productos = await this.clienteService.getProductos();
    }
    this.precios = JSON.parse(JSON.stringify(this.productos));
    if (!cliente.precios) {
      return;
    }
    const preciosEspeciales = Object.entries(cliente.precios);
    this.precios.forEach((p: any) => {
      const i = preciosEspeciales.findIndex(pe => pe[0] === p.id);
      if (i >= 0) {
       p.precio = preciosEspeciales[i][1];
      }
    });
    this.cargando = false;
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
        text: 'Por compra acumulada',
        handler: () => {
          console.log('volumen');
          }
        },
        {
          text: 'Por última compra',
          handler: () => {
            console.log('última compra');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  limpiaPrecios() {
    this.precios = [];
    console.log(this.productos);
  }

}
