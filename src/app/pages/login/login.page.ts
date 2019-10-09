import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loader: any;

  correo: string;
  pass: string;

  constructor(
    private router: Router,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
  }

  async ingresarConCorreo() {
    await this.presentLoading();
    try {
      await this.authService.loginWithEmail(this.correo, this.pass);
      this.loader.dismiss();
      this.router.navigate(['/']);
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/user-not-found') {
        this.presentAlert('Usuario no registrado', 'Por favor registra una cuenta antes de ingresar');
      } else if (error.code === 'no-admin') {
        this.presentAlert('Sólo administradores', 'Tu cuenta no tiene los permisos necesarios para acceder a esta aplicación');
      } else {
        this.presentAlert('Error', 'Algo salió mal, por favor intenta de nuevo');
      }
    }
  }

  async resetPass() {
    if (!this.correo) {
      this.presentAlert('Ingresa tu correo', 'Enviaremos un enlace a tu correo, en el cuál podrás restaurar tu contraseña');
      return;
    }
    this.presentLoading();
    try {
      await this.authService.resetPass(this.correo);
      this.presentAlert('Listo', 'Por favor revisa tu correo, hemos enviado un enlace para que puedas restaurar tu contraseña');
    } catch (error) {
      this.presentAlert('Error', 'Por favor intenta de nuevo más tarde. Estamos teniendo problemas técnicos');
    }
  }

  async presentAlert(title, msg) {
    if (this.loader) { this.loader.dismiss(); }
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     spinner: 'crescent'
    });
    return await this.loader.present();
  }

}
