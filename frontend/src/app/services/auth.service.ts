import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser, ILoginData, IRegisterData } from '../interfaces';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(data: IRegisterData): Observable<IUser> {
    return this.http.post<IUser>(`${this.API}/register`, data, { withCredentials: true });
  }

  login(data: ILoginData): Observable<IUser> {
    return this.http.post<IUser>(`${this.API}/login`, data, { withCredentials: true });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.API}/logout`, {}, { withCredentials: true });
  }

  verifyToken(): Observable<IUser> {
    return this.http.get<IUser>(`${this.API}/verifyToken`, { withCredentials: true });
  }

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.API}/users`, { withCredentials: true });
  }

  updateUser(id: string, data: Partial<IRegisterData>): Observable<IUser> {
    return this.http.put<IUser>(`${this.API}/user/${id}`, data, { withCredentials: true });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/user/${id}`, { withCredentials: true });
  }
}
