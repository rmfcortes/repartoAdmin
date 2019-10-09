import { Component, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { Cliente } from 'src/app/interfaces/clientes.interface';
import { ActionSheetController, PopoverController } from '@ionic/angular';
import { PopComponent } from 'src/app/components/pop/pop.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

  clientes: Cliente[];
  clientesReady = false;

  constructor(
    private clienteService: ClientesService,
    public popoverController: PopoverController,
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

  // Auxiliares

  diasTranscurridos(lastBuy, hoy: Date) {
    const dif = hoy.getTime() - lastBuy;
    const difInDays = dif / ( 1000 * 60 * 60 * 24);
    return difInDays;
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
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

}
