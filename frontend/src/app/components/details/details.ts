import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ITask } from '../../interfaces';
import { TasksStore } from '../../store/tasks.store';
import * as L from 'leaflet';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class DetailsComponent implements AfterViewInit, OnDestroy {
  @Input() task!: ITask;
  private map: L.Map | null = null;

  constructor(private tasksStore: TasksStore) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initMap(): void {
    if (!this.task.location?.latitude || !this.task.location?.longitude) return;

    const el = document.getElementById('details-map');
    if (!el) return;

    this.map = L.map(el).setView(
      [this.task.location.latitude, this.task.location.longitude],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.map);

    L.marker([this.task.location.latitude, this.task.location.longitude]).addTo(this.map);
  }

  exportPDF(): void {
    this.tasksStore.exportToPDF(this.task._id);
  }

  exportCSV(): void {
    this.tasksStore.exportToCSV(this.task._id);
  }
}
