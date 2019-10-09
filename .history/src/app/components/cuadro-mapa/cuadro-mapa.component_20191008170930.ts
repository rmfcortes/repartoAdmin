import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-cuadro-mapa',
  templateUrl: './cuadro-mapa.component.html',
  styleUrls: ['./cuadro-mapa.component.scss'],
})
export class CuadroMapaComponent implements OnInit {

  @Input() persona;
  @Output() cierra = new EventEmitter();
  @Output() ver = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  verClientes() {
    this.ver.emit();
  }

  deSelect() {
    this.cierra.emit();
  }

}
