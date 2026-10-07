import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Table } from './components/table/table';
import { CancellationForm } from './components/cancellation-form/cancellation-form';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: 'main',
    component: Table,
    canActivate: [roleGuard],
    data: {
      roles: ['operador'],
    },
  },

  {
    path: 'cancellations',
    component: CancellationForm,
    canActivate: [roleGuard],
    data: {
      roles: ['supervisor'],
    },
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
