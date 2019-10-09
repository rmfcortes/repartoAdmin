import { Component, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { Cliente } from 'src/app/interfaces/clientes.interface';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

  clientes: Cliente[];

  constructor(
    private clienteService: ClientesService,
  ) { }

  ngOnInit() {
    this.getClientes();
  }

  async getClientes() {
    this.clientes = await this.clienteService.getClientes();
  }

}
