import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title : 'Repartidores',
      url   : '/car',
      icon  : 'pin'
    },
    {
      title : 'Balance',
      url   : '/balance',
      icon  : 'trending-up'
    },
    {
      title : 'Clientes',
      url   : '/clientes',
      icon  : 'contacts'
    },
    {
      title : 'Usuarios',
      url   : '/usuarios',
      icon  : 'water'
    },
    {
      title : 'Productos',
      url   : '/productos',
      icon  : 'basket'
    },
    {
      title : 'Compras',
      url   : '/compras',
      icon  : 'trending-down'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  salir() {
    console.log('Salir');
  }
}
