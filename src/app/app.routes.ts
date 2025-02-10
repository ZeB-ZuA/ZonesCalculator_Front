import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./grafic/grafic.component').then((m) => m.GraficComponent),
  },
  { path: '**', redirectTo: '' }
];
