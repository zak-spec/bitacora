import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DetailsComponent } from '../../components/details/details';
import { TasksStore } from '../../store/tasks.store';
import { ITask } from '../../interfaces';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [DetailsComponent],
  template: `
    <div class="bitacora-background min-h-screen py-12">
      <div class="mx-auto px-6 max-w-6xl">
        <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">Detalles de la Bitácora</h1>
        @if (loading()) {
          <div class="text-center py-8">Cargando...</div>
        } @else if (task()) {
          <app-details [task]="task()!" />
        } @else {
          <div class="text-center py-8">No se encontró la bitácora</div>
        }
      </div>
    </div>
  `,
  styles: [`.bitacora-background { background: linear-gradient(180deg, #f0fdf4 0%, #f5f5f5 100%); }`],
})
export class DetailsPageComponent implements OnInit {
  task = signal<ITask | null>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private tasksStore: TasksStore
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const taskData = await this.tasksStore.getTask(id);
      this.task.set(taskData);
    }
    this.loading.set(false);
  }
}
