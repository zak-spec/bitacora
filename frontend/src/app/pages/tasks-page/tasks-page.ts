import { Component, OnInit } from '@angular/core';

import { CardComponent } from '../../components/card/card';
import { AuthStore } from '../../store/auth.store';
import { TasksStore } from '../../store/tasks.store';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.css',
})
export class TasksPageComponent implements OnInit {
  constructor(
    public authStore: AuthStore,
    public tasksStore: TasksStore
  ) {}

  ngOnInit(): void {
    if (this.authStore.isColaborador()) {
      // Cargar tareas de colaboración usando el email del usuario actual
      const user = this.authStore.user();
      if (user?.email) {
        this.tasksStore.getCollaborationTasks(user.email);
      }
    } else {
      this.tasksStore.getTasks();
    }
  }

  async onDeleteTask(taskId: string): Promise<void> {
    await this.tasksStore.deleteTask(taskId);
  }
}
