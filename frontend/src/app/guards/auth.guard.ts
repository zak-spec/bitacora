import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const authGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Esperar a que termine la verificación
  while (authStore.loading()) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  if (authStore.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  while (authStore.loading()) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  if (authStore.isAuthenticated() && authStore.isAdmin()) {
    return true;
  }

  router.navigate(['/tasks']);
  return false;
};
