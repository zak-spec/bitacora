import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITask } from '../interfaces';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CollaboratorService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTasksByEmail(email: string): Observable<ITask[]> {
    return this.http.post<ITask[]>(`${this.API}/tasks-Collaborator`, { email }, { withCredentials: true });
  }

  addCollaborator(taskId: string, email: string): Observable<ITask> {
    return this.http.post<ITask>(`${this.API}/tasks/${taskId}/collaborators`, { email }, { withCredentials: true });
  }

  removeCollaborator(taskId: string, email: string): Observable<ITask> {
    return this.http.delete<ITask>(`${this.API}/tasks/${taskId}/collaborators`, {
      body: { email },
      withCredentials: true,
    });
  }
}
