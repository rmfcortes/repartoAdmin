import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes.service';

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
    console.log(this.txtSearch.toLocaleLowerCase());
    this.resultados = await this.clienteService.buscaCliente(this.txtSearch.toLocaleLowerCase());
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

}
