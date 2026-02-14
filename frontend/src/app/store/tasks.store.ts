import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TasksService } from '../services/tasks.service';
import { CollaboratorService } from '../services/collaborator.service';
import { FormatoService } from '../services/formato.service';
import { ITask, ITaskFormData } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class TasksStore {
  readonly tasks = signal<ITask[]>([]);
  readonly collaborationTasks = signal<ITask[]>([]);
  readonly loading = signal(false);

  constructor(
    private tasksService: TasksService,
    private collaboratorService: CollaboratorService,
    private formatoService: FormatoService
  ) {}

  async getTasks(): Promise<void> {
    try {
      this.loading.set(true);
      const tasks = await firstValueFrom(this.tasksService.getTasks());
      this.tasks.set(tasks);
    } catch (error) {
      console.error('Error getting tasks:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async getTask(id: string): Promise<ITask | null> {
    try {
      return await firstValueFrom(this.tasksService.getTask(id));
    } catch (error) {
      console.error('Error getting task:', error);
      return null;
    }
  }

  async createTask(data: ITaskFormData): Promise<void> {
    try {
      await firstValueFrom(this.tasksService.createTask(data));
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id: string, data: ITaskFormData): Promise<void> {
    try {
      await firstValueFrom(this.tasksService.updateTask(id, data));
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await firstValueFrom(this.tasksService.deleteTask(id));
      this.tasks.update((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async getCollaborationTasks(email: string): Promise<ITask[]> {
    try {
      const tasks = await firstValueFrom(this.collaboratorService.getTasksByEmail(email));
      this.collaborationTasks.set(tasks);
      return tasks;
    } catch (error) {
      console.error('Error getting collaboration tasks:', error);
      return [];
    }
  }

  exportToPDF(taskId: string): void {
    this.formatoService.exportToPDF(taskId);
  }

  exportToCSV(taskId: string): void {
    this.formatoService.exportToCSV(taskId);
  }
}
