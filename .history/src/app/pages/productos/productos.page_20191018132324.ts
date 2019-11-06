import { Component, OnInit } from '@angular/core';

import { ProductosService } from 'src/app/services/productos.service';

import { Producto } from 'src/app/interfaces/productos.interface';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  productos: Producto[] = [];
  prodsReady = false;

  constructor(
    private productoService: ProductosService,
  ) { }

  ngOnInit() {
    this.getProductos();
  }

  async getProductos() {
    this.productos = await this.productoService.getProducto();
    this.prodsReady = true;
  }

  editar() {

  }

  agregar() {

  }

}
