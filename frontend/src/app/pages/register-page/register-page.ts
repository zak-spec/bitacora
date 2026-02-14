import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPageComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authStore: AuthStore,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['investigador', [Validators.required]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    const result = await this.authStore.signup(this.form.value);
    if (result.success) {
      this.router.navigate(['/login']);
    }
  }
}
