import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './Card.css';
import { useTasks } from '../../Context/TasksContex';
import { Link, useNavigate } from 'react-router-dom';

function Card({ task, index, isCollaborator }) {
  const { deleteTask } = useTasks();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/details/${task._id}`);
  };

  const handleDelete = async(e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta bitácora? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      await deleteTask(task._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/tasks/${task._id}`);
  };

  return (
    <div 
      className="bitacora-entry mb-12 p-8" 
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-center mb-8 border-b-2 border-emerald-200 pb-3">
        <h2 className="text-3xl font-bold text-emerald-900">
          {task.title}
        </h2>
        <div className="flex gap-2">
          {!isCollaborator && (
            <button
              onClick={handleDelete}
              className="action-button bg-red-500 hover:bg-red-600"
            >
              <i className="fas fa-trash-alt mr-2"></i>
              Eliminar
            </button>
          )}
          <button
            onClick={handleEdit}
            className="action-button bg-blue-500 hover:bg-blue-600"
          >
            <i className="fas fa-edit mr-2"></i>
            Editar
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Columna izquierda - Información básica y mapa */}
        <div className="md:w-1/2 space-y-6">
          <div className="info-grid">
            <div className="info-item">
              <i className="fas fa-calendar text-emerald-600"></i>
              <span className="info-label">Fecha:</span>
              <span className="info-value">
                {new Date(task.samplingDateTime).toLocaleDateString()}
              </span>
            </div>
            <div className="info-item">
              <i className="fas fa-cloud text-emerald-600"></i>
              <span className="info-label">Clima:</span>
              <span className="info-value">{task.weatherConditions}</span>
            </div>
            <div className="info-item col-span-2">
              <i className="fas fa-map text-emerald-600"></i>
              <span className="info-label">Coordenadas:</span>
              <span className="info-value">
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-sm text-gray-600">Latitud:</span>
                    <span className="block font-medium">{task.location.latitude}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Longitud:</span>
                    <span className="block font-medium">{task.location.longitude}</span>
                  </div>
                </div>
              </span>
            </div>
          </div>

          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="section-title mb-4">Ubicación del muestreo</h3>
            <div className="map-container relative">
              <div className="absolute top-0 right-0 z-10 bg-white px-4 py-2 m-2 rounded-lg shadow-md text-sm">
                <p className="font-medium text-emerald-800">
                  {task.location.name || 'Ubicación del muestreo'}
                </p>
                <p className="text-gray-600 text-xs">
                  {task.location.latitude}, {task.location.longitude}
                </p>
              </div>
              <MapContainer 
                center={[task.location.latitude, task.location.longitude]} 
                zoom={13} 
                className="map-style"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[task.location.latitude, task.location.longitude]}>
                  <Popup>
                    <div>
                      <h4 className="font-bold">{task.title}</h4>
                      <p>Fecha: {new Date(task.samplingDateTime).toLocaleDateString()}</p>
                      <p>Clima: {task.weatherConditions}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Columna derecha - Descripción y fotos */}
        <div className="md:w-1/2 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="section-title">Descripción del hábitat</h3>
            <p className="info-value">{task.habitatDescription}</p>
          </div>

          {task.samplingPhotos && task.samplingPhotos.length > 0 && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="section-title">Fotos del muestreo</h3>
              <div className="photo-grid">
                {Array.isArray(task.samplingPhotos) ? (
                  task.samplingPhotos.map((photo, idx) => (
                    <div key={idx} className="photo-item">
                      <img
                        src={photo || "https://via.placeholder.com/150?text=No+Image"}
                        alt={`Muestra ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.warn(`Error loading image ${idx}:`, photo);
                          e.target.src = "https://via.placeholder.com/150?text=Error";
                          e.target.onerror = null; // Prevenir bucle infinito
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p>No hay fotos disponibles</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;