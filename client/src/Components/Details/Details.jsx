import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useTasks } from '../../Context/TasksContex';
import './Details.css';

const Details = ({ task }) => {
    const { exportToPDF, exportToCSV } = useTasks();
    
    if (!task || !task.location) {
        return <div className="p-4">Cargando datos...</div>;
    }

    return (
        <div className="bitacora-entry mb-6 sm:mb-12 p-4 sm:p-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-emerald-900 border-b-2 border-emerald-200 pb-3 w-full sm:w-auto mb-4 sm:mb-0">
                    {task.title}
                </h2>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => exportToPDF(task)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-file-pdf"></i>
                        Exportar PDF
                    </button>
                    <button
                        onClick={() => exportToCSV(task)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-file-csv"></i>
                        Exportar CSV
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-8">
                {/* Información básica y mapa - ahora ocupa todo el ancho */}
                <div className="w-full space-y-6">
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
                            <i className="fas fa-map text-emerald-600 text-2xl mb-2"></i>
                            <h4 className="info-label text-xl mb-4">Coordenadas</h4>
                            <div className="grid grid-cols-2 gap-10 mt-2 ml-10 text-center">
                                <div className="coordinate-box">
                                    <span className="coordinate-label">Latitud</span>
                                    <span className="coordinate-value">
                                        {task.location?.latitude || 'No disponible'}
                                    </span>
                                </div>
                                <div className="coordinate-box">
                                    <span className="coordinate-label">Longitud</span>
                                    <span className="coordinate-value">
                                        {task.location?.longitude || 'No disponible'}
                                    </span>
                                </div>
                            </div>
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
                            {task.location.latitude && task.location.longitude ? (
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
                            ) : (
                                <div className="p-4 text-center bg-gray-100 rounded">
                                    No hay coordenadas disponibles para mostrar el mapa
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Descripción y fotos - ahora ocupa todo el ancho */}
                <div className="w-full space-y-8">
                    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="section-title text-2xl">Descripción del hábitat</h3>
                        <p className="info-value text-xl">{task.habitatDescription}</p>
                    </div>

                    {task.samplingPhotos && task.samplingPhotos.length > 0 && (
                        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="section-title text-2xl">Fotos del muestreo</h3>
                            <div className="photo-grid">
                                {Array.isArray(task.samplingPhotos) ? (
                                    task.samplingPhotos.map((photo, idx) => (
                                        <div key={idx} className="photo-item">
                                            <img
                                                src={photo || "https://via.placeholder.com/150?text=No+Image"}
                                                alt={`Muestra ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.warn(`Error loading image:`, photo);
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

            {/* Mantener la sección de especies y observaciones adicionales */}
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
                                                        src={photo || "https://via.placeholder.com/150?text=No+Image"}
                                                        alt={`${species.commonName} ${photoIdx + 1}`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            console.warn(`Error loading species image:`, photo);
                                                            e.target.src = "https://via.placeholder.com/150?text=Error";
                                                            e.target.onerror = null;
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
    );
}

export default Details;
