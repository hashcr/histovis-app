import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import { adminGuard } from './core/auth/admin-guard';
import { loginAuthGuard } from './core/auth/login-auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    redirectTo: 'search',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.page').then(m => m.AdminPage),
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'plugins', pathMatch: 'full' },
      {
        path: 'plugins',
        loadComponent: () => import('./features/admin/plugins/plugins.page').then(m => m.PluginsPage),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.page').then(m => m.LoginPage),
    canActivate: [loginAuthGuard],
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
    loadComponent: () => import('./features/search/image-search/image-search.page').then( m => m.ImageSearchPage),
    canActivate: [authGuard],
  },
  {
    path: 'analyze',
    loadComponent: () => import('./features/analyze/image-analysis/image-analysis.page').then( m => m.ImageAnalysisPage),
    canActivate: [authGuard],
  },
  {
    path: 'analyze/:id',
    loadComponent: () => import('./features/analyze/image-analysis/image-analysis.page').then( m => m.ImageAnalysisPage),
    canActivate: [authGuard],
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.page').then( m => m.AboutPage)
  },
];
