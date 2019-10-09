import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: 'mapa', loadChildren: './pages/mapa/mapa.module#MapaPageModule' },
  { path: 'balance', loadChildren: './pages/balance/balance.module#BalancePageModule' },
  { path: 'clientes', loadChildren: './pages/clientes/clientes.module#ClientesPageModule' },
  { path: 'compras', loadChildren: './pages/compras/compras.module#ComprasPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'productos', loadChildren: './pages/productos/productos.module#ProductosPageModule' },
  { path: 'usuarios', loadChildren: './pages/usuarios/usuarios.module#UsuariosPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
