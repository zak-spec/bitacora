import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home-page/home-page').then(m => m.HomePageComponent) },
  { path: 'login', loadComponent: () => import('./pages/login-page/login-page').then(m => m.LoginPageComponent) },
  { path: 'register', loadComponent: () => import('./pages/register-page/register-page').then(m => m.RegisterPageComponent) },
  { path: 'create-user', canActivate: [adminGuard], loadComponent: () => import('./pages/create-user-page/create-user-page').then(m => m.CreateUserPageComponent) },
  { path: 'About', loadComponent: () => import('./pages/about-page/about-page').then(m => m.AboutPageComponent) },

  // Protected routes
  { path: 'tasks', canActivate: [authGuard], loadComponent: () => import('./pages/tasks-page/tasks-page').then(m => m.TasksPageComponent) },
  { path: 'add-task', canActivate: [authGuard], loadComponent: () => import('./pages/tasks-form-page/tasks-form-page').then(m => m.TasksFormPageComponent) },
  { path: 'tasks/:id', canActivate: [authGuard], loadComponent: () => import('./pages/tasks-form-page/tasks-form-page').then(m => m.TasksFormPageComponent) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./pages/profile-page/profile-page').then(m => m.ProfilePageComponent) },
  { path: 'details/:id', canActivate: [authGuard], loadComponent: () => import('./pages/details-page/details-page').then(m => m.DetailsPageComponent) },
  { path: 'collaborator', canActivate: [authGuard], loadComponent: () => import('./pages/collaborator-page/collaborator-page').then(m => m.CollaboratorPageComponent) },
  { path: 'search', canActivate: [authGuard], loadComponent: () => import('./pages/search-page/search-page').then(m => m.SearchPageComponent) },
  { path: 'users', canActivate: [adminGuard], loadComponent: () => import('./pages/users-page/users-page').then(m => m.UsersPageComponent) },
  { path: 'search-users', canActivate: [adminGuard], loadComponent: () => import('./pages/search-user-page/search-user-page').then(m => m.SearchUserPageComponent) },

  { path: '**', redirectTo: '' },
];
