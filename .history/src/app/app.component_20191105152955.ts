import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title : 'Repartidores',
      url   : '/mapa',
      icon  : 'car'
    },
    {
      title : 'Balance',
      url   : '/balance',
      icon  : 'trending-up'
    },
    {
      title : 'Clientes',
      url   : '/clientes',
      icon  : 'home'
    },
    {
      title : 'Colaboradores',
      url   : '/usuarios',
      icon  : 'contacts'
    },
    {
      title : 'Productos',
      url   : '/productos',
      icon  : 'basket'
    },
    {
      title : 'Reseñas',
      url   : '/rate',
      icon  : 'star'
    },
  ];

  constructor(
    private router: Router,
    private platform: Platform,
    private menu: MenuController,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private authService: AuthService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ir(root) {
    this.menu.enable(true);
    setTimeout(() => {
      this.router.navigate([root]);
    }, 300);
  }

  salir() {
    this.router.navigate(['/login']);
    this.menu.enable(false);
    setTimeout(() => {
      this.authService.logout();
    }, 1000);
  }
}
