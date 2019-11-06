import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'mapa',
    pathMatch: 'full'
  },
  { path: 'mapa', loadChildren: './pages/mapa/mapa.module#MapaPageModule', canActivate: [AuthGuard] },
  { path: 'balance', loadChildren: './pages/balance/balance.module#BalancePageModule', canActivate: [AuthGuard] },
  { path: 'clientes', loadChildren: './pages/clientes/clientes.module#ClientesPageModule', canActivate: [AuthGuard] },
  { path: 'compras', loadChildren: './pages/compras/compras.module#ComprasPageModule', canActivate: [AuthGuard] },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'productos', loadChildren: './pages/productos/productos.module#ProductosPageModule', canActivate: [AuthGuard] },
  { path: 'usuarios', loadChildren: './pages/usuarios/usuarios.module#UsuariosPageModule', canActivate: [AuthGuard] },
  { path: 'rate', loadChildren: './pages/rate/rate.module#RatePageModule', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
