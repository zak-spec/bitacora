import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITask, ITaskFormData } from '../interfaces';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${this.API}/tasks`, { withCredentials: true });
  }

  getTask(id: string): Observable<ITask> {
    return this.http.get<ITask>(`${this.API}/tasks/${id}`, { withCredentials: true });
  }

  createTask(data: ITaskFormData): Observable<ITask> {
    return this.http.post<ITask>(`${this.API}/tasks`, data, { withCredentials: true });
  }

  updateTask(id: string, data: ITaskFormData): Observable<ITask> {
    return this.http.put<ITask>(`${this.API}/tasks/${id}`, data, { withCredentials: true });
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/tasks/${id}`, { withCredentials: true });
  }
}
