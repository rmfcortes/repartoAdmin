import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  colaboradores: Usuario[] = [];

  constructor(
    private usuarioService: UsuariosService,
  ) { }

  ngOnInit() {
  }

  async getColaboradores() {
    this.colaboradores = await this.usuarioService.getColaboradores();
  }

}
