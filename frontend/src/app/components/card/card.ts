import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ITask } from '../../interfaces';
import { AuthStore } from '../../store/auth.store';
import * as L from 'leaflet';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterModule, DatePipe],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class CardComponent implements AfterViewInit, OnDestroy {
  @Input() task!: ITask;
  @Input() index = 0;
  @Output() onDelete = new EventEmitter<string>();

  showDeleteConfirm = signal(false);
  private map: L.Map | null = null;

  constructor(public authStore: AuthStore) {}

  get mapId(): string {
    return `map-card-${this.task._id}-${this.index}`;
  }

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

    const el = document.getElementById(this.mapId);
    if (!el) return;

    this.map = L.map(el, {
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
    }).setView([this.task.location.latitude, this.task.location.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.map);

    L.marker([this.task.location.latitude, this.task.location.longitude]).addTo(this.map);
  }

  confirmDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }

  executeDelete(): void {
    this.onDelete.emit(this.task._id);
    this.showDeleteConfirm.set(false);
  }
}
