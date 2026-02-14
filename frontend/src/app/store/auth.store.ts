import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IUser, ILoginData, IRegisterData } from '../interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly user = signal<IUser | null>(null);
  readonly users = signal<IUser[]>([]);
  readonly isAuthenticated = signal(false);
  readonly loading = signal(true);
  readonly errors = signal<string[]>([]);

  readonly isAdmin = computed(() => this.user()?.rol === 'administrador');
  readonly isInvestigador = computed(() => this.user()?.rol === 'investigador');
  readonly isColaborador = computed(() => this.user()?.rol === 'colaborador');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.checkAuth();
  }

  async checkAuth(): Promise<void> {
    try {
      this.loading.set(true);
      const user = await firstValueFrom(this.authService.verifyToken());
      this.user.set(user);
      this.isAuthenticated.set(true);
      if (user.rol === 'administrador') {
        await this.fetchAllUsers();
      }
    } catch {
      this.user.set(null);
      this.isAuthenticated.set(false);
    } finally {
      this.loading.set(false);
    }
  }

  async signup(data: IRegisterData): Promise<{ success: boolean }> {
    try {
      this.errors.set([]);
      await firstValueFrom(this.authService.register(data));
      // Si el admin crea el usuario, no redirigir al login
      if (this.isAdmin()) {
        await this.fetchAllUsers();
        return { success: true };
      }
      return { success: true };
    } catch (error: any) {
      const msg = error?.error?.message || error?.error || 'Error en el registro';
      this.errors.set(Array.isArray(msg) ? msg : [msg]);
      return { success: false };
    }
  }

  async signin(data: ILoginData): Promise<string> {
    try {
      this.errors.set([]);
      const user = await firstValueFrom(this.authService.login(data));
      this.user.set(user);
      this.isAuthenticated.set(true);

      // Redirigir según rol
      if (user.rol === 'administrador') {
        await this.fetchAllUsers();
        return '/users';
      } else if (user.rol === 'colaborador') {
        return '/collaborator';
      }
      return '/tasks';
    } catch (error: any) {
      const msg = error?.error?.message || error?.error || 'Credenciales incorrectas';
      this.errors.set(Array.isArray(msg) ? msg : [msg]);
      return '';
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.authService.logout());
    } catch {
      // Continuar con logout local
    }
    this.user.set(null);
    this.isAuthenticated.set(false);
    this.users.set([]);
    this.router.navigate(['/login']);
  }

  async fetchAllUsers(): Promise<void> {
    try {
      const users = await firstValueFrom(this.authService.getAllUsers());
      this.users.set(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  async updateUser(id: string, data: Partial<IRegisterData>): Promise<void> {
    try {
      await firstValueFrom(this.authService.updateUser(id, data));
      await this.fetchAllUsers();
    } catch (error: any) {
      const msg = error?.error?.message || 'Error actualizando usuario';
      this.errors.set([msg]);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await firstValueFrom(this.authService.deleteUser(id));
      this.users.update((prev) => prev.filter((u) => u._id !== id));
    } catch (error: any) {
      const msg = error?.error?.message || 'Error eliminando usuario';
      this.errors.set([msg]);
    }
  }
}
