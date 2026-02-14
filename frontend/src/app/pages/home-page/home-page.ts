import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePageComponent {
  constructor(
    public authStore: AuthStore,
    private router: Router
  ) {
    // Si ya está autenticado, redirigir según rol
    if (this.authStore.isAuthenticated()) {
      const user = this.authStore.user();
      if (user?.rol === 'administrador') this.router.navigate(['/users']);
      else if (user?.rol === 'colaborador') this.router.navigate(['/collaborator']);
      else this.router.navigate(['/tasks']);
    }
  }
}
