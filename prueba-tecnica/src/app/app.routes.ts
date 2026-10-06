import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'main',
    loadComponent: () => import('./interfaces/main/main').then((m) => m.Main),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
