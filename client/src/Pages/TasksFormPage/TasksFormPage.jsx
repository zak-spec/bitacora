import React, { useState, useEffect } from 'react'
import { useAuth } from '../../Context/AuthContext'
import "./TasksFormPage.css"
const TasksFormPage = () => {
  
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    samplingDateTime: new Date().toISOString().slice(0, 16),
    location: {
      latitude: '',
      longitude: ''
    },
    weatherConditions: '',
    habitatDescription: '',
    samplingPhotos: [],
    speciesDetails: [{
      scientificName: '',
      commonName: '',
      family: '',
      sampleQuantity: 0,
      plantState: '',
      speciesPhotos: []
    }],
    additionalObservations: ''
  });

  useEffect(() => {
    // Obtener ubicación actual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
        },
        (error) => console.error(error)
      );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Aquí irá la lógica para enviar los datos
  };

  const handleSpeciesChange = (index, field, value) => {
    const newSpeciesDetails = [...formData.speciesDetails];
    newSpeciesDetails[index][field] = value;
    setFormData(prev => ({
      ...prev,
      speciesDetails: newSpeciesDetails
    }));
  };

  const addSpecies = () => {
    setFormData(prev => ({
      ...prev,
      speciesDetails: [...prev.speciesDetails, {
        scientificName: '',
        commonName: '',
        family: '',
        sampleQuantity: 0,
        plantState: '',
        speciesPhotos: []
      }]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Nueva Muestra Botánica</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Título:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Fecha y Hora de Muestreo:</label>
          <input
            type="datetime-local"
            value={formData.samplingDateTime}
            onChange={(e) => setFormData({...formData, samplingDateTime: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Latitud:</label>
            <input
              type="number"
              value={formData.location.latitude}
              onChange={(e) => setFormData({...formData, location: {...formData.location, latitude: parseFloat(e.target.value)}})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Longitud:</label>
            <input
              type="number"
              value={formData.location.longitude}
              onChange={(e) => setFormData({...formData, location: {...formData.location, longitude: parseFloat(e.target.value)}})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">Condiciones Climáticas:</label>
          <input
            type="text"
            value={formData.weatherConditions}
            onChange={(e) => setFormData({...formData, weatherConditions: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Descripción del Hábitat:</label>
          <textarea
            value={formData.habitatDescription}
            onChange={(e) => setFormData({...formData, habitatDescription: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Fotos del Muestreo:</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFormData({...formData, samplingPhotos: Array.from(e.target.files)})}
            className="w-full p-2 border rounded"
            accept="image/*"
            required
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Detalles de Especies</h3>
          {formData.speciesDetails.map((species, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Nombre Científico:</label>
                  <input
                    type="text"
                    value={species.scientificName}
                    onChange={(e) => handleSpeciesChange(index, 'scientificName', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Nombre Común:</label>
                  <input
                    type="text"
                    value={species.commonName}
                    onChange={(e) => handleSpeciesChange(index, 'commonName', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block mb-2">Familia:</label>
                <input
                  type="text"
                  value={species.family}
                  onChange={(e) => handleSpeciesChange(index, 'family', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block mb-2">Cantidad de Muestra:</label>
                  <input
                    type="number"
                    value={species.sampleQuantity}
                    onChange={(e) => handleSpeciesChange(index, 'sampleQuantity', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Estado de la Planta:</label>
                  <input
                    type="text"
                    value={species.plantState}
                    onChange={(e) => handleSpeciesChange(index, 'plantState', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block mb-2">Fotos de la Especie:</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleSpeciesChange(index, 'speciesPhotos', Array.from(e.target.files))}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecies}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Agregar Especie
          </button>
        </div>

        <div>
          <label className="block mb-2">Observaciones Adicionales:</label>
          <textarea
            value={formData.additionalObservations}
            onChange={(e) => setFormData({...formData, additionalObservations: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Guardar Muestra
        </button>
      </form>
    </div>
  );
}

export default TasksFormPage;
