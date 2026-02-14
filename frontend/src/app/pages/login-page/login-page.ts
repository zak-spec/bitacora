import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPageComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authStore: AuthStore,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Si ya está autenticado, redirigir
    if (this.authStore.isAuthenticated()) {
      this.redirectByRole();
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    const redirectPath = await this.authStore.signin(this.form.value);
    if (redirectPath) {
      this.router.navigate([redirectPath]);
    }
  }

  private redirectByRole(): void {
    const user = this.authStore.user();
    if (!user) return;
    if (user.rol === 'administrador') this.router.navigate(['/users']);
    else if (user.rol === 'colaborador') this.router.navigate(['/collaborator']);
    else this.router.navigate(['/tasks']);
  }
}
