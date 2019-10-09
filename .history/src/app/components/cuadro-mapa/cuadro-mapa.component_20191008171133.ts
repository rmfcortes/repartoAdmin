import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-cuadro-mapa',
  templateUrl: './cuadro-mapa.component.html',
  styleUrls: ['./cuadro-mapa.component.scss'],
})
export class CuadroMapaComponent implements OnInit {

  @Input() persona;
  @Output() cierra = new EventEmitter();
  @Output() clientes = new EventEmitter();
  @Output() ruta = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  verClientes() {
    this.clientes.emit();
  }

  verRuta() {
    this.ruta.emit();
  }

  deSelect() {
    this.cierra.emit();
  }

}
