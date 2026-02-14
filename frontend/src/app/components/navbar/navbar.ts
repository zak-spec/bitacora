import { Component, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  isOpen = signal(true);
  isMobileMenuOpen = signal(false);
  isLoggingOut = signal(false);

  constructor(
    public authStore: AuthStore,
    private router: Router
  ) {}

  toggleSidebar(): void {
    this.isOpen.update((v) => !v);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  async onLogout(): Promise<void> {
    this.isLoggingOut.set(true);
    await this.authStore.logout();
    this.isLoggingOut.set(false);
  }
}
