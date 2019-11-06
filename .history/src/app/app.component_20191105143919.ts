import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MapaPage } from './pages/mapa/mapa.page';

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
    private mapaPage: MapaPage,
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
    this.router.navigate([root]);
  }

  salir() {
    this.mapaPage.pedSub.unsubscribe();
    this.router.navigate(['/login']);
    this.menu.enable(false);
    this.authService.logout();
  }
}
