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
    this.getColaboradores();
  }

  async getColaboradores() {
    this.colaboradores = await this.usuarioService.getCola();
    console.log(this.colaboradores);
  }

  enfoca(i) {
    const input = document.getElementById(`foto${i}`);
    console.log(input);
  }

  onFileSelected(event) {
    // this.subiendoFoto = true;
    const width = 300;
    const heigth = 300;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {

        const img = document.createElement('img');
        // When the event "onload" is triggered we can resize the image.
        img.onload = () => {
            // We create a canvas and get its context.
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // We set the dimensions at the wanted size.
            canvas.width = width;
            canvas.height = heigth;

            // We resize the image with the canvas method drawImage();
            ctx.drawImage(img, 0, 0, width, heigth);

            const dataURI = canvas.toDataURL();
            const base64 = dataURI.split('data:image/png;base64,')[1];
            // this.url = dataURI;
            // this.imagenes64 = base64;
            // this.subiendoFoto = false;
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

}
