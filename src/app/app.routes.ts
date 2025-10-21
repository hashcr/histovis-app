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
    redirectTo: 'upload',
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
    loadComponent: () => import('./features/upload/upload-image/upload-image.page').then( m => m.UploadImagePage),
    canActivate: [authGuard],
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/image-search/image-search.page').then( m => m.ImageSearchPage)
  },
];
