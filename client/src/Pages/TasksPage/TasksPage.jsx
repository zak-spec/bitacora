import React, { useEffect } from "react";
import { useTasks } from "../../Context/TasksContex";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "./TasksPage.css";

function TasksPage() {
  const { tasks, getTasks } = useTasks();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        await getTasks();
      } catch (error) {
        console.error(error);
      }
    };

    loadTasks();
  }, []);

  return (
    <div className="bitacora-background min-h-screen py-12">
      <div className="bitacora-container mx-auto px-6 max-w-4xl">
        <h1 className="bitacora-title text-center">
          Registros de Muestreo Botánico
        </h1>

        {tasks.length > 0 &&
          tasks.map((task, index) => (
            <div
              key={task._id}
              className="bitacora-entry mb-10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h2 className="text-3xl font-bold mb-6 text-emerald-900 border-b-2 border-emerald-200 pb-2">
                {task.title}
              </h2>

              <div className="info-section">
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
                  <div className="info-item">
                    <i className="fas fa-map-marker-alt text-emerald-600"></i>
                    <span className="info-label">Latitud:</span>
                    <span className="info-value">{task.location.latitude}</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-map-marker-alt text-emerald-600"></i>
                    <span className="info-label">Longitud:</span>
                    <span className="info-value">{task.location.longitude}</span>
                  </div>
                </div>

                {/* Agregar mapa después de las coordenadas */}
                <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="map-container">
                    <MapContainer 
                      center={[task.location.latitude, task.location.longitude]} 
                      zoom={13} 
                      style={{ height: '300px', width: '100%', borderRadius: '8px' }}
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

                <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
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
                              src={`${photo}`}
                              alt={`Muestra ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error(`Error loading image ${idx}:`, photo);
                                e.target.src = "https://via.placeholder.com/150?text=Error";
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

              <div className="mt-6">
                <h3 className="section-title">Especies encontradas</h3>
                <div className="species-grid">
                  {task.speciesDetails.map((species, index) => (
                    <div key={index} className="species-card">
                      <div className="species-header">
                        <i className="fas fa-leaf text-emerald-600 mr-2"></i>
                        <h4 className="species-name">{species.scientificName}</h4>
                      </div>
                      
                      <div className="species-info-grid">
                        <div className="species-info-item">
                          <span className="info-label">Nombre común:</span>
                          <span className="info-value">{species.commonName}</span>
                        </div>
                        <div className="species-info-item">
                          <span className="info-label">Familia:</span>
                          <span className="info-value">{species.family}</span>
                        </div>
                        <div className="species-info-item">
                          <span className="info-label">Cantidad:</span>
                          <span className="info-value">{species.sampleQuantity}</span>
                        </div>
                        <div className="species-info-item">
                          <span className="info-label">Estado:</span>
                          <span className="info-value">{species.plantState}</span>
                        </div>
                      </div>

                      {species.speciesPhotos && species.speciesPhotos.length > 0 && (
                        <div className="species-photos">
                          <h4 className="species-subtitle">Fotos de la especie:</h4>
                          <div className="photo-grid">
                            {Array.isArray(species.speciesPhotos) &&
                              species.speciesPhotos.map((photo, photoIdx) => (
                                <div key={photoIdx} className="photo-item">
                                  <img
                                    src={`${photo}`}
                                    alt={`${species.commonName} ${photoIdx + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error(
                                        `Error loading species image ${photoIdx}:`,
                                        photo
                                      );
                                      e.target.src =
                                        "https://via.placeholder.com/150?text=Error";
                                    }}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {task.additionalObservations && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Observaciones adicionales
                  </h3>
                  <p className="text-gray-700">{task.additionalObservations}</p>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default TasksPage;
