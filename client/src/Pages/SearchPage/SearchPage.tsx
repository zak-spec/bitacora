import React, { useState, useEffect } from 'react';
import { useTasks } from '../../Context/TasksContex';
import { Link } from 'react-router-dom';
import './SearchPage.css';

// Mantener solo las interfaces necesarias
interface Location {
  latitude: number;
  longitude: number;
}

interface SpeciesDetail {
  scientificName: string;
  commonName: string;
}

interface Task {
  _id: string;
  title: string;
  samplingDateTime: string;
  location: Location;
  weatherConditions: string;
  habitatDescription: string;
  speciesDetails: SpeciesDetail[];
}

interface SearchFilters {
  dateRange: { start: string; end: string };
  location: {
    latitude: string;
    longitude: string;
  };
  habitat: string;
  climate: string;
}

export const SearchPage: React.FC = () => {
  const { tasks, getTasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: { start: '', end: '' },
    location: {
      latitude: '',
      longitude: ''
    },
    habitat: '',
    climate: '',
  });
  const [sortBy, setSortBy] = useState('date');
  const [filteredResults, setFilteredResults] = useState<Task[]>([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Agregar un useEffect para cargar las tareas al montar el componente
  useEffect(() => {
    getTasks();
  }, []);

  // Función para filtrar y ordenar las tareas
  const filterAndSortTasks = () => {
    let results = [...tasks] as Task[];

    // Aplicar búsqueda por texto
    if (searchQuery) {
      results = results.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${task.location.latitude}, ${task.location.longitude}`.includes(searchQuery) ||
        task.speciesDetails.some(species => 
          species.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          species.commonName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Aplicar filtros
    if (filters.dateRange.start || filters.dateRange.end) {
      results = results.filter(task => {
        const taskDate = new Date(task.samplingDateTime);
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
        
        if (startDate && endDate) {
          return taskDate >= startDate && taskDate <= endDate;
        } else if (startDate) {
          return taskDate >= startDate;
        } else if (endDate) {
          return taskDate <= endDate;
        }
        return true;
      });
    }

    // Nuevo filtro de ubicación
    if (filters.location.latitude || filters.location.longitude) {
      results = results.filter(task => {
        const matchLatitude = !filters.location.latitude || 
          task.location.latitude.toString().includes(filters.location.latitude);
        const matchLongitude = !filters.location.longitude || 
          task.location.longitude.toString().includes(filters.location.longitude);
        return matchLatitude && matchLongitude;
      });
    }

    // Filtrar por hábitat y clima
    if (filters.habitat) {
      results = results.filter(task => 
        task.habitatDescription.toLowerCase()
          .includes(filters.habitat.toLowerCase())
      );
    }

    if (filters.climate) {
      results = results.filter(task => 
        task.weatherConditions.toLowerCase()
          .includes(filters.climate.toLowerCase())
      );
    }

    // Mejorar el ordenamiento
    results.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.samplingDateTime).getTime() - new Date(a.samplingDateTime).getTime();
        
        case 'location':
          // Ordenar primero por latitud, luego por longitud
          const latDiff = a.location.latitude - b.location.latitude;
          if (latDiff !== 0) return latDiff;
          return a.location.longitude - b.location.longitude;
        
        case 'relevance':
          // Ordenar por relevancia basada en coincidencias con la búsqueda
          const getRelevanceScore = (task: Task) => {
            let score = 0;
            const searchLower = searchQuery.toLowerCase();
            
            // Título coincidente da mayor puntaje
            if (task.title.toLowerCase().includes(searchLower)) score += 3;
            
            // Coincidencias en especies
            task.speciesDetails.forEach(species => {
              if (species.scientificName.toLowerCase().includes(searchLower)) score += 2;
              if (species.commonName.toLowerCase().includes(searchLower)) score += 1;
            });
            
            // Coincidencias en hábitat y clima
            if (task.habitatDescription.toLowerCase().includes(searchLower)) score += 1;
            if (task.weatherConditions.toLowerCase().includes(searchLower)) score += 1;
            
            return score;
          };
          
          const scoreA = getRelevanceScore(a);
          const scoreB = getRelevanceScore(b);
          return scoreB - scoreA; // Mayor puntaje primero
          
        default:
          return 0;
      }
    });

    setFilteredResults(results);
  };

  // Modificar el useEffect existente para incluir la dependencia getTasks
  useEffect(() => {
    filterAndSortTasks();
  }, [searchQuery, filters, sortBy, tasks, getTasks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterAndSortTasks();
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Buscar por título, ubicación o especies..."
            className="search-input"
          />
          {/* <button type="submit" className="search-button">Buscar</button> */}
          <button 
            type="button"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className={`advanced-search-toggle ${showAdvancedSearch ? 'active' : ''}`}
          >
            {showAdvancedSearch ? 'Búsqueda Simple' : 'Búsqueda Avanzada'}
          </button>
        </div>

        <div className={`filters-section ${showAdvancedSearch ? 'show' : 'hide'}`}>
          <div className="filter-group">
            <label>Rango de fechas:</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, start: e.target.value}})}
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, end: e.target.value}})}
            />
          </div>

          <div className="filter-group location-filter">
            <label>Ubicación:</label>
            <div className="location-inputs">
              <input
                type="text"
                value={filters.location.latitude}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  location: { ...prev.location, latitude: e.target.value }
                }))}
                placeholder="Latitud"
                className="search-input"
              />
              <input
                type="text"
                value={filters.location.longitude}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  location: { ...prev.location, longitude: e.target.value }
                }))}
                placeholder="Longitud"
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Hábitat:</label>
            <input
              type="text"
              value={filters.habitat}
              onChange={(e) => setFilters({...filters, habitat: e.target.value})}
              placeholder="Tipo de hábitat..."
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Clima:</label>
            <input
              type="text"
              value={filters.climate}
              onChange={(e) => setFilters({...filters, climate: e.target.value})}
              placeholder="Condiciones climáticas..."
              className="search-input"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Ordenar por fecha</option>
            <option value="location">Ordenar por ubicación</option>
            <option value="relevance">Ordenar por relevancia</option>
          </select>
        </div>
      </form>
      
      <div className="results-container">
        {filteredResults.length === 0 ? (
          <div className="no-results">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p>No se encontraron resultados</p>
          </div>
        ) : (
          filteredResults.map((task: Task) => (
           < Link to={`/details/${task._id}`}> 
            <div key={task._id} className="result-card">
              <h3>📝 {task.title}</h3>
              <p>📅 Fecha: {new Date(task.samplingDateTime).toLocaleDateString()}</p>
              <div className="location-display">
                <span>📍 Ubicación:</span> {task.location.latitude}, {task.location.longitude}
              </div>
              <p>🌿 Especies: {task.speciesDetails.map(s => s.scientificName).join(', ')}</p>
              <p>🏞️ Hábitat: {task.habitatDescription}</p>
              <p>🌤️ Clima: {task.weatherConditions}</p>
            </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;