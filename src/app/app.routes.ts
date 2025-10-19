import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'search',
    redirectTo: 'logout',
    pathMatch: 'full',
  },
  {
    path: 'analyze',
    redirectTo: 'logout',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    redirectTo: 'logout',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'logout',
    loadComponent: () => import('./features/logout/logout.page').then(m => m.LogoutPage)
  },
  {
    path: 'upload',
    loadComponent: () => import('./features/upload/upload.page').then( m => m.UploadPage),
    canActivate: [authGuard],
  },
];
