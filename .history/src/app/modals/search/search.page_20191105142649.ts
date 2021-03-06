import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes.service';
import { Cliente } from 'src/app/interfaces/clientes.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  txtSearch = '';

  resultados: any = [];

  constructor(
    private modalCtrl: ModalController,
    private clienteService: ClientesService,
  ) { }

  ngOnInit() {
  }

  async busca() {
    this.resultados = await this.clienteService.buscaCliente(this.txtSearch.toLocaleLowerCase());
  }

  async esteMero(item) {
    const cliente: Cliente = await this.clienteService.getCliente(item.id);
    this.modalCtrl.dismiss(cliente);
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

}
