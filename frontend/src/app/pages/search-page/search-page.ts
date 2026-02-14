import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TasksStore } from '../../store/tasks.store';
import { ITask, SearchFilters } from '../../interfaces';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [RouterModule, FormsModule, DatePipe],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
})
export class SearchPageComponent implements OnInit {
  searchQuery = '';
  showAdvanced = false;
  sortBy = 'date';
  filteredResults = signal<ITask[]>([]);

  filters: SearchFilters = {
    dateRange: { start: '', end: '' },
    location: { latitude: '', longitude: '' },
    habitat: '',
    climate: '',
    species: '',
  };

  constructor(public tasksStore: TasksStore) {}

  ngOnInit(): void {
    this.tasksStore.getTasks();
  }

  filterAndSort(): void {
    let results = [...this.tasksStore.tasks()];

    // Búsqueda por texto
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      results = results.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          `${t.location.latitude}, ${t.location.longitude}`.includes(this.searchQuery) ||
          t.speciesDetails.some(
            (s) =>
              s.scientificName.toLowerCase().includes(q) ||
              s.commonName.toLowerCase().includes(q)
          )
      );
    }

    // Filtro fecha
    if (this.filters.dateRange.start || this.filters.dateRange.end) {
      results = results.filter((t) => {
        const d = new Date(t.samplingDateTime);
        const start = this.filters.dateRange.start ? new Date(this.filters.dateRange.start) : null;
        let end = this.filters.dateRange.end ? new Date(this.filters.dateRange.end) : null;
        if (end) end.setDate(end.getDate() + 1);
        if (start && end) return d >= start && d < end;
        if (start) return d >= start;
        if (end) return d < end;
        return true;
      });
    }

    // Filtro ubicación
    if (this.filters.location.latitude || this.filters.location.longitude) {
      results = results.filter((t) => {
        const matchLat = !this.filters.location.latitude || 
          t.location.latitude.toString().includes(this.filters.location.latitude);
        const matchLng = !this.filters.location.longitude || 
          t.location.longitude.toString().includes(this.filters.location.longitude);
        return matchLat && matchLng;
      });
    }

    // Filtro hábitat
    if (this.filters.habitat) {
      results = results.filter((t) =>
        t.habitatDescription.toLowerCase().includes(this.filters.habitat.toLowerCase())
      );
    }

    // Filtro clima
    if (this.filters.climate) {
      results = results.filter((t) =>
        t.weatherConditions.toLowerCase().includes(this.filters.climate.toLowerCase())
      );
    }

    // Filtro especies
    if (this.filters.species) {
      results = results.filter((t) =>
        t.speciesDetails.some(
          (s) =>
            s.scientificName.toLowerCase().includes(this.filters.species.toLowerCase()) ||
            s.commonName.toLowerCase().includes(this.filters.species.toLowerCase())
        )
      );
    }

    // Ordenamiento
    results.sort((a, b) => {
      if (this.sortBy === 'date') {
        return new Date(b.samplingDateTime).getTime() - new Date(a.samplingDateTime).getTime();
      } else if (this.sortBy === 'location') {
        const d = a.location.latitude - b.location.latitude;
        return d !== 0 ? d : a.location.longitude - b.location.longitude;
      }
      return 0;
    });

    this.filteredResults.set(results);
  }

  toggleAdvanced(): void {
    this.showAdvanced = !this.showAdvanced;
  }

  onSearch(): void {
    this.filterAndSort();
  }
}
