import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthStore } from '../../store/auth.store';
import { UsersCardComponent } from '../../components/users-card/users-card';
import { IUser } from '../../interfaces';

@Component({
  selector: 'app-search-user-page',
  standalone: true,
  imports: [FormsModule, UsersCardComponent],
  templateUrl: './search-user-page.html',
  styleUrl: './search-user-page.css',
})
export class SearchUserPageComponent implements OnInit {
  searchTerm = '';
  roleFilter = 'todos';

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

  get filteredUsers(): IUser[] {
    return (this.authStore.users() || []).filter((u) => {
      const matchSearch =
        u.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchRole = this.roleFilter === 'todos' || u.rol === this.roleFilter;
      return matchSearch && matchRole;
    });
  }

  async onDelete(id: string): Promise<void> {
    await this.authStore.deleteUser(id);
  }

  onEdit(user: IUser): void {
    console.log('Edit user:', user);
  }
}
