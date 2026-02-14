import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthStore } from '../../store/auth.store';
import { UsersCardComponent } from '../../components/users-card/users-card';
import { IUser } from '../../interfaces';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [UsersCardComponent],
  template: `
    <div class="min-h-screen py-6 sm:py-12" style="background: linear-gradient(180deg, #f0fdf4 0%, #f5f5f5 100%);">
      <div class="mx-auto px-4 sm:px-6 max-w-6xl">
        <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">Gestión de Usuarios</h1>
        @for (user of authStore.users(); track user._id) {
          <app-users-card [user]="user" (onDelete)="onDelete($event)" (onEdit)="onEdit($event)" />
        }
      </div>
    </div>
  `,
})
export class UsersPageComponent implements OnInit {
  constructor(
    public authStore: AuthStore,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authStore.isAdmin()) {
      this.router.navigate(['/tasks']);
      return;
    }
    this.authStore.fetchAllUsers();
  }

  async onDelete(id: string): Promise<void> {
    await this.authStore.deleteUser(id);
  }

  onEdit(user: IUser): void {
    // Navegar a edición del usuario u otra lógica
    console.log('Edit user:', user);
  }
}
