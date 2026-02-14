import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FormatoService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  exportToCSV(taskId: string): void {
    this.http
      .get(`${this.API}/csv/${taskId}`, {
        responseType: 'blob',
        withCredentials: true,
      })
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `bitacora_${taskId}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => console.error('Error al exportar CSV:', err),
      });
  }

  exportToPDF(taskId: string): void {
    this.http
      .get(`${this.API}/pdf/${taskId}`, {
        responseType: 'blob',
        withCredentials: true,
      })
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `bitacora_${taskId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => console.error('Error al exportar PDF:', err),
      });
  }
}
