import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TasksStore } from '../../store/tasks.store';

@Component({
  selector: 'app-collaborator-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './collaborator-page.html',
  styleUrl: './collaborator-page.css',
})
export class CollaboratorPageComponent {
  email = '';
  message = '';

  constructor(
    private tasksStore: TasksStore,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    this.message = '';

    if (!this.email.trim()) {
      this.message = 'El correo es requerido';
      return;
    }

    try {
      const tasks = await this.tasksStore.getCollaborationTasks(this.email);
      if (tasks && tasks.length > 0) {
        this.router.navigate(['/tasks']);
      } else {
        this.message = 'No se encontraron tareas asociadas a este correo';
      }
    } catch {
      this.message = 'Error al buscar tareas. Intente de nuevo.';
    }
  }
}
