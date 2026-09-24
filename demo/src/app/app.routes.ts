import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'catalogo' },

  // Públicas
  {
    path: 'catalogo',
    title: 'Catálogo | Tienda de Camisetas',
    loadComponent: () =>
      import('./features/catalogo/camiseta-list/camiseta-list.component').then((m) => m.CamisetaListComponent),
  },
  {
    path: 'carrito',
    title: 'Carrito | Tienda de Camisetas',
    loadComponent: () =>
      import('./features/carrito/cart-view/cart-view.component').then((m) => m.CartViewComponent),
  },
  {
    path: 'login',
    title: 'Iniciar sesión | Tienda de Camisetas',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    title: 'Registro | Tienda de Camisetas',
    loadComponent: () =>
      import('./features/auth/registro/registro.component').then((m) => m.RegistroComponent),
  },

  // Privadas (requieren sesión con JWT vigente)
  {
    path: 'checkout',
    title: 'Confirmar compra | Tienda de Camisetas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/carrito/compra-view/compra-view.component').then((m) => m.CompraViewComponent),
  },
  {
    path: 'mis-compras',
    title: 'Mis compras | Tienda de Camisetas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/compras/mis-compras/mis-compras.component').then((m) => m.MisComprasComponent),
  },

  { path: '**', redirectTo: 'catalogo' },
];
